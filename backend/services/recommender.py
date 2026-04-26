import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from services.database import get_all_tracked_products

def get_recommendations(target_product_name, top_n=6):
    """
    Advanced recommendation engine inspired by Flipkart/Amazon.
    Suggests similar products, price-bracket matches, and relevant accessories.
    """
    try:
        products = get_all_tracked_products()
        if not products or len(products) < 2:
            return []

        df = pd.DataFrame(products)
        df['price'] = pd.to_numeric(df.get('price', 0), errors='coerce').fillna(0)
        
        # 3. Robust target matching: Check if search query contains DB name or vice-versa
        target_product_lower = target_product_name.lower()
        
        def is_match(name):
            n = name.lower()
            return n == target_product_lower or n in target_product_lower or target_product_lower in n
            
        target_matches = df[df['name'].apply(is_match)]
        
        if target_matches.empty:
            # Try word-by-word overlap (at least 2 words match)
            def word_overlap(name):
                n_words = set(re.findall(r'\w+', name.lower()))
                q_words = set(re.findall(r'\w+', target_product_lower))
                return len(n_words.intersection(q_words)) >= 2
            target_matches = df[df['name'].apply(word_overlap)]

        if target_matches.empty:
            # Fallback to trending if target not in DB yet
            trending = df.sort_values(by='last_updated', ascending=False).head(top_n)
            return [ {**r.to_dict(), 'is_trending': True, 'rec_type': 'Trending'} for _, r in trending.iterrows() if '_id' not in r]

        target_prod = target_matches.iloc[0]
        target_cat = target_prod.get('category', '').lower()
        target_price = float(target_prod.get('price', 0))
        
        # 1. Broaden the pool: Category Match OR Price Bracket Match OR Accessory Match
        # Price Bracket: +/- 20%
        price_mask = (df['price'].between(target_price * 0.8, target_price * 1.2))
        
        # Accessory Logic
        accessory_mask = pd.Series([False] * len(df))
        accessories = ["case", "cover", "charger", "glass", "earbuds", "headphones", "adapter"]
        main_devices = ["phone", "mobile", "laptop", "tablet", "watch"]
        
        if any(dev in target_cat for dev in main_devices) or any(dev in target_product_name.lower() for dev in main_devices):
            # Target is a main device, suggest accessories
            accessory_mask = df['name'].str.lower().apply(lambda x: any(acc in x for acc in accessories))
        elif any(acc in target_cat for acc in accessories) or any(acc in target_product_name.lower() for acc in accessories):
            # Target is an accessory, suggest main devices
            accessory_mask = df['name'].str.lower().apply(lambda x: any(dev in x for dev in main_devices))

        category_mask = (df['category'].str.lower() == target_cat)
        
        # Combined mask (exclude target)
        final_mask = (df['name'] != target_product_name) & (category_mask | price_mask | accessory_mask)
        relevant_df = df[final_mask].copy()

        # If still too few, just take anything in price bracket or category separately
        if len(relevant_df) < top_n:
            final_mask = (df['name'] != target_product_name) & (category_mask | price_mask)
            relevant_df = df[final_mask].copy()

        if len(relevant_df) == 0:
            trending = df.sort_values(by='last_updated', ascending=False).head(top_n)
            return [ {**r.to_dict(), 'is_trending': True} for _, r in trending.iterrows() if '_id' not in r]

        # 2. Similarity Ranking using TF-IDF on Name + Category
        relevant_df['features'] = relevant_df['name'] + " " + relevant_df['category'].fillna('')
        target_row = target_prod.to_frame().T
        target_row['features'] = target_row['name'] + " " + target_row['category'].fillna('')
        calc_df = pd.concat([target_row, relevant_df]).reset_index(drop=True)
        
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(calc_df['features'])
        cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix).flatten()
        
        similar_indices = cosine_sim[1:].argsort()[::-1]
        
        recommendations = []
        added_names = set()
        
        for idx in similar_indices:
            if len(recommendations) >= top_n: break
            actual_idx = idx + 1
            rec = calc_df.iloc[actual_idx].to_dict()
            if rec['name'] in added_names: continue
            
            # Label the recommendation type
            if any(acc in rec['name'].lower() for acc in accessories):
                rec['rec_type'] = "Accessory"
            elif rec.get('category') == target_prod.get('category'):
                rec['rec_type'] = "Similar Model"
            else:
                rec['rec_type'] = "In Price Range"

            if '_id' in rec: del rec['_id']
            if 'features' in rec: del rec['features']
            rec['similarity'] = float(cosine_sim[actual_idx])
            recommendations.append(rec)
            added_names.add(rec['name'])
                
        return recommendations

    except Exception as e:
        print(f"Recommender Error: {e}")
        return []
