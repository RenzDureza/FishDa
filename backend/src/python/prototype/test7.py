import cv2 as cv
import numpy as np
import os
import sys


def save(name, img, dir="debug"):
    os.makedirs(dir, exist_ok=True)
    if img is None or img.size == 0:
        return
    cv.imwrite(f"{dir}/{name}.jpg", img)


def segment_fish(img):
    lab = cv.cvtColor(img, cv.COLOR_BGR2LAB)
    l, a, b = cv.split(lab)

    clahe = cv.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    l = clahe.apply(l)

    img = cv.cvtColor(cv.merge((l, a, b)), cv.COLOR_LAB2BGR)

    hsv = cv.cvtColor(img, cv.COLOR_BGR2HSV)
    h_ch, s_ch, v_ch = cv.split(hsv)

    clahe_global = cv.createCLAHE(clipLimit=2.0)
    v_clahe = np.clip(clahe_global.apply(v_ch).astype(np.int32) + 30, 0, 255).astype(
        np.uint8
    )

    hsv_clahe = cv.merge((h_ch, s_ch, v_clahe))
    rgb_clahe = cv.cvtColor(hsv_clahe, cv.COLOR_HSV2BGR)
    _, s2, v2 = cv.split(cv.cvtColor(rgb_clahe, cv.COLOR_BGR2HSV))

    otsu = cv.GaussianBlur(v_clahe, (5,5), 0)
    _, otsu = cv.threshold(v_clahe, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU)
    fish_sat = cv.inRange(s2, 0, 50)
    fish_val = cv.inRange(v2, 60, 255)

    fish_mask = cv.bitwise_and(fish_sat, fish_val)
    
    k5 = np.ones((5, 5), np.uint8)
    k7 = np.ones((7, 7), np.uint8)

    otsu = cv.morphologyEx(otsu, cv.MORPH_CLOSE, k5)
    otsu = cv.morphologyEx(otsu, cv.MORPH_OPEN, k5)
    fish_mask = cv.morphologyEx(fish_mask, cv.MORPH_CLOSE, k7)
    fish_mask = cv.morphologyEx(fish_mask, cv.MORPH_OPEN, k5)

    combined = cv.bitwise_and(otsu, fish_mask)
    combined = cv.morphologyEx(combined, cv.MORPH_OPEN, k5)

    contours, _ = cv.findContours(combined, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    contours = [c for c in contours if cv.contourArea(c) > 5000]

    if not contours:
        return None, None, 0, 0, 0, 0

    fish_contour = max(contours, key=cv.contourArea)

    hull = cv.convexHull(fish_contour)

    fx, fy, fw, fh = cv.boundingRect(hull)

    return combined, hull, fx, fy, fw, fh


def get_fish_region_coords(fx, fy, fw, fh):
    head = (fy, fy + int(0.30 * fh), fx, fx + fw)
    body = (fy + int(0.30 * fh), fy + int(0.75 * fh), fx, fx + fw)
    tail = (fy + int(0.75 * fh), fy + fh, fx, fx + fw)
    return head, body, tail


def evaluate_body_color(body_roi):
    hsv = cv.cvtColor(body_roi, cv.COLOR_BGR2HSV)
    h, s, v = cv.split(hsv)

    valid = (
        (s > 25) &
        (v > 50) &
        (v < 240)
    )

    if np.sum(valid) < 50:
        return 0.0, 0.0, 0.0

    v_med = np.median(v[valid])

    consistency = np.abs(v - v_med) < 40
    valid = valid & consistency

    if np.sum(valid) < 50:
        return 0.0, 0.0, 0.0

    return (
        float(np.mean(h[valid])),
        float(np.mean(s[valid])),
        float(np.mean(v[valid]))
    )
def eye_features(eye_roi):
    gray = cv.cvtColor(eye_roi, cv.COLOR_BGR2GRAY)

    valid = gray > 20

    if np.sum(valid) == 0:
        return 0.0, 0.0, 0.0

    lap = cv.Laplacian(gray, cv.CV_64F)
    sharpness = np.var(lap[valid])

    edges = cv.Canny(gray, 50, 150)
    edge_density = np.mean(edges[valid] > 0)

    hsv = cv.cvtColor(eye_roi, cv.COLOR_BGR2HSV)
    h, s, v = cv.split(hsv)

    redness = np.mean(((h < 10) | (h > 160)) & valid)

    return sharpness, edge_density, redness


def main():
    img_path = sys.argv[1] if len(sys.argv) > 1 else "bangus.jpg"
    img = cv.imread(img_path)

    if img is None:
        print("Cannot read image")
        return

    h_img, w_img = img.shape[:2]

    mask, hull, fx, fy, fw, fh = segment_fish(img)
    if hull is None:
        print("No fish detected")
        return

    fish_mask = np.zeros((h_img, w_img), dtype=np.uint8)
    cv.drawContours(fish_mask, [hull], -1, 255, -1)

    fish_only = cv.bitwise_and(img, img, mask=fish_mask)

    (ey0, ey1, ex0, ex1), \
    (by0, by1, bx0, bx1), \
    (ty0, ty1, tx0, tx1) = get_fish_region_coords(fx, fy, fw, fh)

    eye_roi = fish_only[ey0:ey1, ex0:ex1]
    # eye_gray = cv.cvtColor(eye_roi, cv.COLOR_BGR2GRAY)
    # _, eye_mask = cv.threshold(eye_gray, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU)
    # eye_roi = cv.bitwise_and(eye_roi, eye_roi, mask=eye_mask)


    body_roi = fish_only[by0:by1, bx0:bx1]
    # body_gray = cv.cvtColor(body_roi, cv.COLOR_BGR2GRAY)
    # _, body_mask = cv.threshold(body_gray, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU)
    # body_roi = cv.bitwise_and(body_roi, body_roi, mask=body_mask)

    # body_roi = img[by0:by1, bx0:bx1]
    # body_mask = fish_mask[by0:by1, bx0:bx1]
    # body_roi = cv.bitwise_and(body_roi, body_roi, mask=body_mask)

    tail_roi = fish_only[ty0:ty1, tx0:tx1]

    sharpness, edge_density, redness = eye_features(eye_roi)
    h_mean, s_mean, v_mean = evaluate_body_color(body_roi)

    rect = cv.minAreaRect(hull)
    (_, _), (w, h), _ = rect
    aspect_ratio = max(w, h) / min(w, h)

    print("Fish aspect ratio:", aspect_ratio)
    print("Eye sharpness:", sharpness)
    print("Eye edge density:", edge_density)
    print("Eye redness:", redness)

    print("Body Hue:", h_mean)
    print("Body Saturation:", s_mean)
    print("Body Value:", v_mean)

    result = img.copy()
    cv.drawContours(result, [hull], -1, (0, 255, 0), 2)
    cv.rectangle(result, (fx, fy), (fx + fw, fy + fh), (255, 0, 0), 2)

    save("result", result)
    save("fish_only", fish_only)
    save("eye_roi", eye_roi)
    save("body_roi", body_roi)
    save("tail_roi", tail_roi)

    print("Done.")


if __name__ == "__main__":
    main()
