import os
import sys

import cv2 as cv
import numpy as np


def save(name, img, dir="eye_debug"):
    os.makedirs(dir, exist_ok=True)
    if img is None or img.size == 0:
        return
    out = img.copy()
    h, w = out.shape[:2]
    scale = min(800 / w, 800 / h, 1.0)
    if scale < 1.0:
        out = cv.resize(out, (int(w * scale), int(h * scale)))
    cv.imwrite(f"{dir}/{name}.jpg", out)


def segment_fish(img):
    lab = cv.cvtColor(img, cv.COLOR_BGR2LAB)
    l, a, b = cv.split(lab)

    clahe = cv.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
    l2 = clahe.apply(l)

    lab_enhanced = cv.merge((l2, a, b))
    enhanced = cv.cvtColor(lab_enhanced, cv.COLOR_LAB2BGR)

    gray = cv.cvtColor(enhanced, cv.COLOR_BGR2GRAY)

    _, otsu = cv.threshold(gray, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU)

    a_blur = cv.GaussianBlur(a, (5, 5), 0)
    b_blur = cv.GaussianBlur(b, (5, 5), 0)

    fish_a = cv.inRange(a_blur, 120, 150)  # tune if needed
    fish_b = cv.inRange(b_blur, 120, 170)

    lab_mask = cv.bitwise_and(fish_a, fish_b)

    k5 = np.ones((5, 5), np.uint8)
    k7 = np.ones((7, 7), np.uint8)

    otsu = cv.morphologyEx(otsu, cv.MORPH_CLOSE, k5)
    otsu = cv.morphologyEx(otsu, cv.MORPH_OPEN, k5)

    lab_mask = cv.morphologyEx(lab_mask, cv.MORPH_CLOSE, k7)
    lab_mask = cv.morphologyEx(lab_mask, cv.MORPH_OPEN, k5)

    combined = cv.bitwise_or(otsu, lab_mask)
    combined = cv.morphologyEx(combined, cv.MORPH_CLOSE, k5)

    contours, _ = cv.findContours(combined, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    contours = [c for c in contours if cv.contourArea(c) > 5000]

    if not contours:
        return None, None, 0, 0, 0, 0

    fish_contour = max(contours, key=cv.contourArea)
    fx, fy, fw, fh = cv.boundingRect(fish_contour)

    return combined, fish_contour, fx, fy, fw, fh


def preprocess(roi_bgr):
    gray = cv.cvtColor(roi_bgr, cv.COLOR_BGR2GRAY)
    clahe = cv.createCLAHE(clipLimit=3.0, tileGridSize=(4, 4))
    return clahe.apply(gray)


def get_fish_region_coords(fx, fy, fw, fh):
    eye_end = fy + int(0.25 * fh)
    body_end = fy + int(0.80 * fh)
    tail_end = fy + fh
    x0, x1 = fx, fx + fw
    return (
        (fy, eye_end, x0, x1),
        (eye_end, body_end, x0, x1),
        (body_end, tail_end, x0, x1),
    )


# Eyes
def extract_eye(gray_clahe, roi_h, roi_w):
    candidates = []
    min_r = max(4, int(min(roi_h, roi_w) * 0.05))
    max_r = max(min_r + 4, int(min(roi_h, roi_w) * 0.35))

    params = cv.SimpleBlobDetector_Params()
    params.filterByArea = True
    params.minArea = np.pi * min_r**2 * 0.5
    params.maxArea = np.pi * max_r**2 * 2.0
    params.filterByCircularity = True
    params.minCircularity = 0.40
    params.filterByConvexity = True
    params.minConvexity = 0.55
    params.filterByInertia = True
    params.minInertiaRatio = 0.30
    params.filterByColor = True
    params.blobColor = 0

    detector = cv.SimpleBlobDetector_create(params)
    kps = detector.detect(gray_clahe)
    if kps:
        kp = max(kps, key=lambda k: k.size)
        cx, cy = int(kp.pt[0]), int(kp.pt[1])
        r = max(min_r, int(kp.size / 2))
        candidates.append((cx, cy, r, 0.72, "blob_gray"))

    block = max(11, (min(roi_h, roi_w) // 4) | 1)
    adapt = cv.adaptiveThreshold(
        cv.GaussianBlur(gray_clahe, (5, 5), 0),
        255,
        cv.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv.THRESH_BINARY_INV,
        blockSize=block,
        C=8,
    )

    k3 = np.ones((3, 3), np.uint8)
    adapt = cv.morphologyEx(adapt, cv.MORPH_OPEN, k3)
    adapt = cv.morphologyEx(adapt, cv.MORPH_CLOSE, k3)

    ctrs, _ = cv.findContours(adapt, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    best_score, best_c = 0, None
    for c in ctrs:
        area = cv.contourArea(c)
        if area < 15 or area > roi_h * roi_w * 0.20:
            continue
        perim = cv.arcLength(c, True)
        if perim == 0:
            continue
        circ = 4 * np.pi * area / (perim**2)
        if circ < 0.30:
            continue
        score = circ * np.sqrt(area)
        if score > best_score:
            best_score, best_c = score, c
    if best_c is not None:
        (cx, cy), r = cv.minEnclosingCircle(best_c)
        candidates.append(
            (int(cx), int(cy), max(min_r, int(r)), 0.68, "adaptive_contour")
        )

    return candidates


def select_best_candidate(candidates, roi_h, roi_w):
    def score(c):
        cx, cy, r, conf, _ = c
        border_pen = (
            0.25 if (cx < r or cy < r or cx > roi_w - r or cy > roi_h - r) else 0
        )
        pos_bonus = 0.05 if cy < roi_h * 0.60 else 0
        return conf + pos_bonus - border_pen

    return max(candidates, key=score)


def eye_clarity(eye):
    if eye is None or eye.size == 0:
        return 0.0, 0.0

    gray = cv.cvtColor(eye, cv.COLOR_BGR2GRAY)

    valid = gray > 10
    if np.sum(valid) == 0:
        return 0.0, 0.0

    lap = cv.Laplacian(gray, cv.CV_64F)
    sharpness = lap[valid].var()

    median = np.median(gray[valid])

    lower = int(max(0, 0.5 * median))
    upper = int(min(255, 1.5 * median))

    edges = cv.Canny(gray, lower, upper)
    edge_density = np.sum(edges[valid] > 0) / np.sum(valid)

    return sharpness, edge_density


def eye_redness(eye):
    if eye is None or eye.size == 0:
        return 0.0

    hsv = cv.cvtColor(eye, cv.COLOR_BGR2HSV)
    h, s, v = cv.split(hsv)

    valid = (v > 30) & (s > 40)

    if np.sum(valid) == 0:
        return 111

    red = (h <= 10) | (h >= 160)

    redness = np.sum(red & valid) / np.sum(valid)
    return float(redness)


# body
def shininess_evaluation(body_roi):
    _, s_ch, v_ch = cv.split(cv.cvtColor(body_roi, cv.COLOR_BGR2HSV))
    body_area = body_roi.shape[0] * body_roi.shape[1]
    v_top = np.percentile(v_ch, 85)
    s_low = np.percentile(s_ch, 30)
    specular_mask = ((v_ch > v_top) & (s_ch < s_low)).astype(np.uint8) * 255

    specular_coverage = cv.countNonZero(specular_mask) / body_area
    specular_average = np.mean(v_ch[specular_mask > 0])

    return specular_coverage, specular_average


def evaluate_body_color(body_roi):
    hsv = cv.cvtColor(body_roi, cv.COLOR_BGR2HSV)
    h_ch, s_ch, v_ch = cv.split(hsv)
    return np.mean(h_ch), np.mean(s_ch), np.mean(v_ch)


def main():
    img_path = sys.argv[1] if len(sys.argv) >= 2 else "bangus.jpg"
    img = cv.imread(img_path)

    if img is None:
        print("Cannot read image")
        return

    img_h, img_w = img.shape[:2]

    combined, fish_contour, fx, fy, fw, fh = segment_fish(img)
    if fish_contour is None:
        print("No fish detected")
        return

    eye_coords, body_coords, tail_coords = get_fish_region_coords(fx, fy, fw, fh)

    ey0, ey1, ex0, ex1 = eye_coords
    by0, by1, bx0, bx1 = body_coords
    ty0, ty1, tx0, tx1 = tail_coords

    eye_roi = img[ey0:ey1, ex0:ex1]
    body_roi = img[by0:by1, bx0:bx1]
    tail_roi = img[ty0:ty1, tx0:tx1]

    # feature extraction for eyes
    gray_clahe = preprocess(eye_roi)
    roi_h, roi_w = gray_clahe.shape[:2]

    candidates = extract_eye(gray_clahe, roi_h, roi_w)
    if not candidates:
        print("No eye detected")
        return

    cx, cy, r, conf, method = select_best_candidate(candidates, roi_h, roi_w)
    full_cx, full_cy = ex0 + cx, ey0 + cy

    eye_mask = np.zeros((img_h, img_w), dtype=np.uint8)
    cv.circle(eye_mask, (full_cx, full_cy), r, 255, -1)
    eye_isolated = cv.bitwise_and(img, img, mask=eye_mask)

    # for random forest
    eye_redness_ratio = eye_redness(eye_isolated)
    sharpness, edge_density = eye_clarity(eye_isolated)

    # feature extraction for body
    specular_coverage, specular_average = shininess_evaluation(body_roi)
    (
        h_mean_body,
        s_mean_body,
        v_mean_body,
    ) = evaluate_body_color(body_roi)

    print("eye clarity: ", sharpness)
    print("eye edge density: ", edge_density)
    print("eye redness: ", eye_redness_ratio)
    print("body mean Hue: ", h_mean_body)
    print("body mean Saturation: ", s_mean_body)
    print("body mean Value: ", v_mean_body)
    print("body shine coverage: ", specular_coverage)
    print("body shine average: ", specular_average)

    # for debuggings
    result = img.copy()
    cv.drawContours(result, [fish_contour], -1, (0, 255, 0), 2)

    cv.rectangle(result, (fx, fy), (fx + fw, fy + fh), (255, 0, 0), 2)

    cx = fx + fw // 2
    cy = fy + fh // 2
    cv.circle(result, (cx, cy), 5, (0, 0, 255), -1)

    save("debug_fish_detection", result)

    cv.circle(result, (full_cx, full_cy), r, (0, 0, 255), 5)
    cv.circle(eye_mask, (full_cx, full_cy), r, 255, -1)
    save("result", result)
    save("combined", combined)
    save("eye", eye_roi)
    save("body", body_roi)
    save("tail", tail_roi)
    save("isolate_eye", eye_isolated)

    print("Done:", (full_cx, full_cy), r)
    print("Best Candidate:", method)


if __name__ == "__main__":
    main()
