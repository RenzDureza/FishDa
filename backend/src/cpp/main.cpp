#include <opencv2/core.hpp>
#include <opencv2/core/cvstd_wrapper.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/imgproc.hpp>
#include <vector>
#define CPPHTTPLIB_MULTIPART_FORM_DATA
#include "httplib.h"

#include <iostream>
#include <opencv2/opencv.hpp>

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
    Mat hsv;
    cvtColor(img, hsv, COLOR_BGR2HSV);

    // CLAHE
    vector<Mat> HSVChannels;
    split(hsv, HSVChannels);

    Ptr<CLAHE> clahe = createCLAHE();
    clahe->setClipLimit(4);
    Mat update_hsv_v;
    clahe->apply(HSVChannels[2], update_hsv_v);

    update_hsv_v.copyTo(HSVChannels[2]);
    merge(HSVChannels, hsv);

    Mat output;
    cvtColor(hsv, output, COLOR_HSV2BGR);

	// For testing
    // imshow("test", output);
    // waitKey(0);
    // destroyAllWindows();

    // imwrite("output.jpg", gray);
    res.set_content("{\"status\":\"ok\"}", "application/json");
  });

  cout << "Server running on http://0.0.0.0:8080\n";
  svr.listen("0.0.0.0", 8080);
}
