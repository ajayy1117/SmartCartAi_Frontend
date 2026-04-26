import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import os

# Sample training data for demonstration
# In a real scenario, this would be a large dataset like Amazon Reviews
DATA = [
    ("This product is amazing, changed my life!", 0), # Real
    ("Best quality, fast shipping, highly recommend.", 0), # Real
    ("I love the color and the fit is perfect.", 0), # Real
    ("Great value for money, will buy again.", 0), # Real
    ("Worst product ever, arrived broken.", 0), # Real
    ("BUY NOW!!! BEST PRICE!!! CLICK HERE!!!", 1), # Fake/Spam
    ("Cheap plastic, don't waste your money. Scam.", 1), # Fake/Spam
    ("Excellent product. Excellent service. Excellent price.", 1), # Fake (Repetitive)
    ("I am a real customer and this is a real review of a real product.", 1), # Fake (Defensive)
    ("Super cheap, super fast, super good.", 1), # Fake (Suspiciously generic)
]

class ReviewAnalyzer:
    def __init__(self):
        self.model = None
        self._train_model()

    def _train_model(self):
        df = pd.DataFrame(DATA, columns=['text', 'label'])
        self.model = Pipeline([
            ('tfidf', TfidfVectorizer(ngram_range=(1, 2))),
            ('clf', LogisticRegression())
        ])
        self.model.fit(df['text'], df['label'])

    def analyze(self, text):
        if not text or len(text) < 5:
            return {"prediction": "Inconclusive", "confidence": 0, "is_fake": False}

        # Predict probability
        # label 1 is "Fake"
        probs = self.model.predict_proba([text])[0]
        fake_prob = probs[1]
        
        is_fake = fake_prob > 0.5
        prediction = "Fake" if is_fake else "Genuine"
        confidence = float(fake_prob if is_fake else probs[0])

        return {
            "prediction": prediction,
            "confidence": round(confidence * 100, 2),
            "is_fake": bool(is_fake)
        }

# Singleton instance
analyzer = ReviewAnalyzer()

def analyze_review_text(text):
    return analyzer.analyze(text)
