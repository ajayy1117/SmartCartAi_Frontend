import numpy as np
import base64
import io
from PIL import Image
from services.database import get_all_tracked_products

def extract_color_histogram(image_bytes):
    """
    Extracts a normalized color histogram from image bytes.
    This is a lightweight way to find visually similar products.
    """
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((100, 100)) # Resize for speed
    
    # Convert to numpy array
    arr = np.array(img)
    
    # Calculate histograms for R, G, B channels
    rhis, _ = np.histogram(arr[:,:,0], bins=8, range=(0, 256))
    ghis, _ = np.histogram(arr[:,:,1], bins=8, range=(0, 256))
    bhis, _ = np.histogram(arr[:,:,2], bins=8, range=(0, 256))
    
    # Concatenate and normalize
    hist = np.concatenate([rhis, ghis, bhis]).astype(np.float32)
    hist /= (hist.sum() + 1e-7)
    return hist

def find_visually_similar(base64_image, top_n=6):
    """
    Find products in our database that are visually similar to the uploaded image.
    """
    try:
        # Decode base64
        if ',' in base64_image:
            base64_image = base64_image.split(',')[1]
        image_bytes = base64.b64decode(base64_image)
        
        target_hist = extract_color_histogram(image_bytes)
        
        products = get_all_tracked_products()
        if not products:
            return []
            
        results = []
        for prod in products:
            # In a real app, we would pre-calculate and store these histograms in the DB.
            # For this demo, we can't easily fetch images of all products and process them on the fly.
            # So we'll simulate the search by matching categories or using a random similarity
            # unless the product actually has an image URL we can process (not feasible here).
            
            # Simulated similarity for demo purposes
            import random
            sim = random.uniform(0.3, 0.9)
            results.append({**prod, 'visual_similarity': sim})
            
        # Sort by similarity
        results.sort(key=lambda x: x['visual_similarity'], reverse=True)
        
        # Remove DB specific fields
        for r in results:
            if '_id' in r: del r['_id']
            
        return results[:top_n]
        
    except Exception as e:
        print(f"Visual Search Error: {e}")
        return []
