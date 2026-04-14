from fastapi import FastAPI, File, UploadFile
import numpy as np
import cv2 as cv

app = FastAPI()

@app.post("/process_fish")
async def image_analysis(file: UploadFile = File(...)):
    data = await file.read()

    image_bfr = np.frombuffer(data, np.uint8)
    img = cv.imdecode(image_bfr, cv.IMREAD_COLOR)

    if img is None:
        # returns a json
        return {"error" : "Image decoding failed"}

    # fish analyzer
    result = "test"
    
    return {"result" : result}




