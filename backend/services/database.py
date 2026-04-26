from pymongo import MongoClient
import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI')
DB_NAME = os.getenv('DB_NAME', 'SmartCartAI')

try:
    client = MongoClient(MONGO_URI)
    client.admin.command('ping')  # 🔥 Force connection check
    print("[SUCCESS] MongoDB Connected Successfully")
except Exception as e:
    print("[ERROR] MongoDB Connection Failed:", e)

db = client[DB_NAME]

# Collections
users_collection = db["users"]
expenses_collection = db["expenses"]
# Collections (like tables)
products_col    = db['products']
price_hist_col  = db['price_history']
alerts_col      = db['alerts']
users_col       = db['users']


def save_product(name, category, image_url):
    """Save or update a product in the database."""
    existing = products_col.find_one({'name': name})
    if existing:
        return str(existing['_id'])
    
    result = products_col.insert_one({
        'name': name,
        'category': category,
        'image': image_url,
        'created_at': datetime.now(),
        'last_updated': datetime.now()
    })
    return str(result.inserted_id)


def save_price(product_name, platform, price, rating=None, url=None):
    """Save a price snapshot to history."""
    if not price:
        return
    
    price_hist_col.insert_one({
        'product_name': product_name,
        'platform': platform,
        'price': price,
        'rating': rating,
        'url': url,
        'timestamp': datetime.now(),
        'date': datetime.now().strftime('%Y-%m-%d')
    })
    
    # Update last_updated on product
    products_col.update_one(
        {'name': product_name},
        {'$set': {'last_updated': datetime.now()}}
    )


def get_price_history(product_name, platform=None, days=30):
    """Get price history for a product."""
    query = {'product_name': product_name}
    if platform:
        query['platform'] = platform
    
    from datetime import timedelta
    since = datetime.now() - timedelta(days=days)
    query['timestamp'] = {'$gte': since}
    
    records = list(price_hist_col.find(
        query,
        {'_id': 0, 'platform': 1, 'price': 1, 'date': 1, 'timestamp': 1}
    ).sort('timestamp', 1))
    
    return records


def set_alert(product_name, platform, threshold_price, user_id):
    """Set a price alert for a logged-in user."""
    if not user_id:
        raise ValueError("user_id is required to set an alert.")
        
    query = {
        'product_name': product_name,
        'platform': platform,
        'user_id': user_id
    }
        
    alerts_col.delete_many(query)
    
    # Check if the price already met the threshold
    most_recent = list(price_hist_col.find(
        {'product_name': product_name, 'platform': platform}
    ).sort('timestamp', -1).limit(1))
    
    triggered = False
    triggered_at = None
    
    if most_recent and most_recent[0]['price']:
        current_price = most_recent[0]['price']
        if current_price <= threshold_price:
            triggered = True
            triggered_at = datetime.now()
            # Send email immediately
            from .mailer import send_alert_email
            user = get_user_by_id(user_id)
            if user:
                send_alert_email(user['email'], product_name, platform, current_price, threshold_price)
    
    alerts_col.insert_one({
        'product_name': product_name,
        'platform': platform,
        'threshold': threshold_price,
        'user_id': user_id,
        'triggered': triggered,
        'triggered_at': triggered_at,
        'created_at': datetime.now()
    })

def create_user(email, password, name):
    existing = users_col.find_one({'email': email})
    if existing:
        return None
    result = users_col.insert_one({
        'email': email,
        'password': generate_password_hash(password),
        'name': name,
        'created_at': datetime.now()
    })
    return str(result.inserted_id)

def verify_user(email, password):
    user = users_col.find_one({'email': email})
    if user and check_password_hash(user['password'], password):
        return {'id': str(user['_id']), 'email': user['email'], 'name': user.get('name', 'User')}
    return None

def get_user_by_id(user_id):
    from bson.objectid import ObjectId
    try:
        user = users_col.find_one({'_id': ObjectId(user_id)})
        if user:
            return {'id': str(user['_id']), 'email': user['email'], 'name': user.get('name', 'User')}
    except:
        pass
    return None

def get_user_alerts(user_id):
    """Get all alerts for a specific user"""
    return list(alerts_col.find(
        {'user_id': user_id},
        {'_id': 0}
    ).sort('created_at', -1))

def get_product_fallback(query):
    """Fallback to retrieve latest known prices if live scraping fails."""
    # Try to find a product matching the query
    import re
    # Escape query for regex
    safe_query = re.escape(query)
    product = products_col.find_one({'name': {'$regex': safe_query, '$options': 'i'}})
    
    if not product:
        return None
        
    product_name = product['name']
    
    # Get the latest price for each platform using MongoDB aggregation
    pipeline = [
        {'$match': {'product_name': product_name}},
        {'$sort': {'timestamp': -1}},
        {'$group': {
            '_id': '$platform',
            'price': {'$first': '$price'},
            'rating': {'$first': '$rating'},
            'url': {'$first': '$url'}
        }}
    ]
    
    historical = list(price_hist_col.aggregate(pipeline))
    if not historical:
        return None
        
    platforms = []
    for h in historical:
        platforms.append({
            'platform': h['_id'],
            'name': product_name,
            'price': h['price'],
            'rating': h.get('rating'),
            'url': h.get('url'),
            'source': 'database'
        })
        
    return {
        'name': product_name,
        'image': product.get('image'),
        'platforms': platforms
    }


def check_alerts(product_name, platform, current_price):
    """Check if any alerts should be triggered."""
    from .mailer import send_alert_email
    
    alerts = list(alerts_col.find({
        'product_name': product_name,
        'platform': platform,
        'triggered': False
    }))
    
    triggered = []
    for alert in alerts:
        if current_price <= alert['threshold']:
            alerts_col.update_one(
                {'_id': alert['_id']},
                {'$set': {'triggered': True, 'triggered_at': datetime.now()}}
            )
            
            email_target = alert.get('user_email')
            if not email_target and alert.get('user_id'):
                user = get_user_by_id(alert.get('user_id'))
                if user:
                    email_target = user['email']
                    
            if email_target:
                send_alert_email(email_target, product_name, platform, current_price, alert['threshold'])
                
            triggered.append(alert)
    
    return triggered


def get_all_tracked_products():
    """Get all products being tracked."""
    return list(products_col.find({}, {'_id': 0}))

# ── Reviews Collection ──────────────────────
reviews_col = db['reviews']

def get_reviews(product_name):
    """Get all reviews for a product."""
    return list(reviews_col.find(
        {'product_name': product_name},
        {'_id': 0}
    ).sort('timestamp', -1))

def save_review(product_name, user_name, rating, title, body, platform='Internal', verified=True, tags=None):
    """Save a new user review."""
    review = {
        'product_name': product_name,
        'user_name': user_name,
        'rating': rating,
        'title': title,
        'body': body,
        'platform': platform,
        'verified': verified,
        'tags': tags or [],
        'helpful': 0,
        'timestamp': datetime.now(),
        'date': datetime.now().strftime('%Y-%m-%d')
    }
    result = reviews_col.insert_one(review)
    return str(result.inserted_id)

def mark_helpful(product_name, review_id):
    """Increment helpful count for a review."""
    # Note: In a real app we'd use ObjectId, but for now we might use title/timestamp
    reviews_col.update_one(
        {'product_name': product_name, 'title': review_id},
        {'$inc': {'helpful': 1}}
    )

def seed_data():
    if products_col.count_documents({}) == 0:
        print("[SEED] Seeding sample products...")
        samples = [
            ("Sony WH-1000XM5", "Electronics", "https://m.media-amazon.com/images/I/61+9m6pXwDL._SL1500_.jpg", 29990),
            ("Apple iPhone 15", "Mobile", "https://m.media-amazon.com/images/I/71d7rfSl0wL._SL1500_.jpg", 79900),
            ("Nike Air Force 1", "Shoes", "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d4bb93-4522-4da4-a95c-9a4058d92e59/air-force-1-07-shoes-Wr0Q19.png", 7495),
            ("boAt Airdopes 141", "Electronics", "https://m.media-amazon.com/images/I/510S9m3C6VL._SL1500_.jpg", 1299),
            ("Samsung Galaxy S24", "Mobile", "https://m.media-amazon.com/images/I/71pE1GZ3HXL._SL1500_.jpg", 74999)
        ]
        for name, cat, img, price in samples:
            save_product(name, cat, img)
            save_price(name, "amazon", price, 4.5, "#")
            save_price(name, "flipkart", price - 100, 4.3, "#")
            save_review(name, "John Doe", 5, "Amazing product", "High quality!", "amazon")
            save_review(name, "Jane Smith", 4, "Great but pricey", "Really good features.", "flipkart")
            save_review(name, "Bot 123", 1, "BUY CHEAP NOW", "SCAM SCAM", "amazon", False)
        print("[SEED] Database seeded successfully.")

try:
    seed_data()
except Exception as e:
    print(f"[SEED ERROR] {e}")
