#include <opencv2/core.hpp>
#include <opencv2/core/cvstd_wrapper.hpp>
#include <opencv2/core/types.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/imgproc.hpp>
#include <opencv2/opencv.hpp>
#include <iostream>
#include <regex>
#include <vector>

#include "httplib.h"
#define CPPHTTPLIB_MULTIPART_FORM_DATA

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

    // CSC
    Mat hsv_img;
    cvtColor(img, hsv_img, COLOR_BGR2HSV);

    // CLAHE
    vector<Mat> HSVChannels;
    split(hsv_img, HSVChannels);

    Ptr<CLAHE> clahe = createCLAHE();
    clahe->setClipLimit(4);
    Mat update_hsv_v;
    clahe->apply(HSVChannels[2], update_hsv_v);

    update_hsv_v.copyTo(HSVChannels[2]);
    // merge(HSVChannels, hsv_img);

	// Otsu's Thresholding
	Mat binary_img;
	Mat hsv_img_V = HSVChannels[2];
	threshold(hsv_img_V, binary_img, 0, 255, THRESH_OTSU | THRESH_BINARY);
	
	// Canny Edge Detection
	Mat blurred_img, edges_img;
	GaussianBlur(binary_img, blurred_img, Size(3, 3), 0);
	Canny(blurred_img, edges_img, 50, 150, 3);

	// imshow("Test", edges_img);
	// waitKey(0);
	// destroyAllWindows();
	
    res.set_content("{\"status\":\"ok\"}", "application/json");
  });

  cout << "Server running on http://0.0.0.0:8080\n";
  svr.listen("0.0.0.0", 8080);
}
