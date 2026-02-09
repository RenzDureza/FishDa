#include <iostream>
#include <opencv2/core.hpp>
#include <opencv2/core/types.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/imgproc.hpp>
#include <opencv2/opencv.hpp>
#include <vector>

#define CPPHTTPLIB_MULTIPART_FORM_DATA
#include "httplib.h"

using namespace std;
using namespace cv;
using namespace httplib;

int main() {
  Server svr;

  svr.Post("/upload", [](const Request &req, Response &res) {
    if (!req.form.has_file("image")) {
      res.status = 400;
      res.set_content("{\"error\":\"no image\"}", "application/json");
      return;
    }

    const auto &file = req.form.get_file("image");

    vector<uchar> buffer(file.content.begin(), file.content.end());
    Mat img = imdecode(buffer, IMREAD_COLOR);

    if (img.empty()) {
      res.status = 500;
      res.set_content("{\"error\":\"opencv failed\"}", "application/json");
      return;
    }
	
	int img_width = img.cols;
	int img_height = img.rows;

    // CSC
    Mat hsv_img;
    cvtColor(img, hsv_img, COLOR_BGR2HSV);

    vector<Mat> HSVChannels;
    split(hsv_img, HSVChannels);
    Mat V = HSVChannels[2];

    // CLAHE
    Ptr<CLAHE> clahe = createCLAHE(2.0, Size(8, 8));
    Mat V_clahe;
    clahe->apply(V, V_clahe);
    V = V_clahe;
    HSVChannels[2] = V;
    merge(HSVChannels, hsv_img);

    // Eyes ROI
    Rect eye_roi_rect(img_width * 0.20, img_height * 0.05, img_width * 0.60,
                      img_height * 0.10);
    eye_roi_rect &= Rect(0, 0, img.cols, img.rows);

    // Gills ROI
    Rect gill_roi_rect(img_width * 0.20, img_height * 0.14, img_width * 0.60,
                       img_height * 0.10);
    gill_roi_rect &= Rect(0, 0, img.cols, img.rows);

    // Body ROI
    Rect body_roi_rect(img_width * 0.20, img_height * 0.24, img_width * 0.60,
                       img_height * 0.55);
    body_roi_rect &= Rect(0, 0, img.cols, img.rows);

    // Tail ROI
    Rect tail_roi_rect(img_width * 0.10, img_height * 0.78, img_width * 1.0,
                       img_height * 0.20);
    tail_roi_rect &= Rect(0, 0, img.cols, img.rows);

    // Otsu Thresholding
    Mat otsu_mask;
    threshold(V, otsu_mask, 0, 255, THRESH_OTSU + THRESH_BINARY_INV);

    Mat kernel = getStructuringElement(MORPH_ELLIPSE, Size(3, 3));
    dilate(otsu_mask, otsu_mask, kernel, Point(-1, -1), 1);

    // Canny Edge Detection
    Mat blurred_img, edges_img;
    GaussianBlur(otsu_mask, blurred_img, Size(5, 5), 0);
    Canny(blurred_img, edges_img, 50, 150);

    vector<vector<Point>> EyeContours;
    findContours(edges_img, EyeContours, RETR_EXTERNAL, CHAIN_APPROX_SIMPLE);

    Mat eye_mask = Mat::zeros(img.size(), CV_8UC1);
    Mat extracted_eyes = Mat::zeros(img.size(), CV_8UC3);

    double circularity_threshold = 0.6;
    double min_pupil_area = 20;
    double max_pupil_area = 800;

    for (auto &c : EyeContours) {
      double area = contourArea(c);
      double perimeter = arcLength(c, true);
      if (perimeter == 0)
        continue;

      double circularity = 4 * CV_PI * area / (perimeter * perimeter);

      if (circularity > circularity_threshold && area > min_pupil_area &&
          area < max_pupil_area) {

        Point2f center;
        float radius;
        minEnclosingCircle(c, center, radius);

        int margin = 20;
        if (center.x < margin || center.y < margin ||
            center.x > img.cols - margin || center.y > img.rows - margin)
          continue;

        if (radius < 3 || radius > 25)
          continue;

        int cx = (int)center.x;
        int cy = (int)center.y;
        uchar v = V.at<uchar>(cy, cx);
        if (v > 120)
          continue;

        float eyeRadius = radius * 1.5f;
        circle(eye_mask, center, (int)eyeRadius, Scalar(255), FILLED);
      }
    }

    img.copyTo(extracted_eyes, eye_mask);

    // Get eye score
    Mat hsv_eye;
    cvtColor(extracted_eyes, hsv_eye, COLOR_BGR2HSV);

    Mat gray_eye;
    cvtColor(extracted_eyes, gray_eye, COLOR_BGR2GRAY);
    int total_pixel_eyes = countNonZero(gray_eye);

    Mat red_mask1, red_mask2, red_mask;
    inRange(hsv_eye, Scalar(0, 50, 50), Scalar(10, 255, 255), red_mask1);
    inRange(hsv_eye, Scalar(160, 50, 50), Scalar(179, 255, 255), red_mask2);
    red_mask = red_mask1 | red_mask2;

    int red_count = countNonZero(red_mask);
    double red_ratio =
        (total_pixel_eyes > 0) ? (double)red_count / total_pixel_eyes : 0.0;

    Mat eye_edges;
    Canny(gray_eye, eye_edges, 50, 150);
    int strong_edges_count = countNonZero(eye_edges);
    double eye_clarity = (total_pixel_eyes > 0)
                             ? (double)strong_edges_count / total_pixel_eyes
                             : 0.0;

    double eye_score = (1.0 - red_ratio) * 0.4 + eye_clarity * 0.6;

    // For debugging to!!!
    // imshow("Extracted Eyes", extracted_eyes);
    // waitKey(0);
    // destroyAllWindows();

    res.set_content(
        "{\"status\":\"ok\", \"eye_score\":" + to_string(eye_score) + "}",
        "application/json");
  });

  cout << "Server running on http://0.0.0.0:8080\n";
  svr.listen("0.0.0.0", 8080);
}
