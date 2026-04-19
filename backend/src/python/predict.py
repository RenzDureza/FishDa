import joblib

model = joblib.load("quality_model.pkl")

sample_features = [0.61723,0.354569,56,0.472635,164,0.478455,0.087595,0.339651,0]

result = model.predict([sample_features])

print(f"Prediction: {result}")