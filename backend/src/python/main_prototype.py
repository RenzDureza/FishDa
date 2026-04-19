from fastapi import FastAPI, UploadFile, File, HTTPException
import numpy as np
import cv2

app = FastAPI()

def preprocess_image(image_bytes: bytes):
    np_arr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if image is None:
        raise ValueError("Invalid image file.")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    equalized = cv2.equalizeHist(gray)
    edges = cv2.Canny(equalized, 50, 150)

    return image, gray, equalized, edges


def extract_features(image, gray, edges):
    brightness = float(np.mean(gray))

    # Approximate redness using the red channel average.
    red_channel = image[:, :, 2]
    redness = float(np.mean(red_channel))

    # Texture estimate using edge density.
    texture = float(np.mean(edges > 0))

    return brightness, redness, texture


def rule_based_score(brightness, redness, texture):
    brightness_score = min(brightness / 255.0, 1.0)
    redness_score = min(redness / 255.0, 1.0)
    texture_score = min(texture, 1.0)

    score = (brightness_score * 0.3) + (redness_score * 0.4) + (texture_score * 0.3)
    return round(score, 2)


def dummy_ml_score(brightness, redness, texture):
    score = ((brightness / 255.0) * 0.2) + ((redness / 255.0) * 0.5) + (texture * 0.3)
    return round(min(score, 1.0), 2)


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")

    try:
        image, gray, equalized, edges = preprocess_image(image_bytes)

        brightness, redness, texture = extract_features(image, gray, edges)

        has_fish = True
        species = "tilapia"

        overall_score = rule_based_score(brightness, redness, texture)
        eye_score = overall_score * 0.5
        body_score = overall_score * 0.3
        tail_score = overall_score * 0.2
        ml_score = dummy_ml_score(brightness, redness, texture)

        average_score = (overall_score + ml_score) / 2

        if average_score > 0.7:
            quality = "high"
        elif average_score > 0.4:
            quality = "mid"
        else:
            quality = "low"

        return {
            "has_fish": has_fish,
            "species": species,
            "eye_score": eye_score,
            "body_score": body_score,
            "tail_score": tail_score,
            "overall_score": overall_score,
            "ml_score": ml_score,
            "quality": quality
        }

    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err))
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))
