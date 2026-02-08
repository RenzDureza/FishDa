#define CPPHTTPLIB_MULTIPART_FORM_DATA
#include "httplib.h"

#include <fstream>
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

    // Convert uploaded bytes to OpenCV Mat directly
    vector<uchar> buffer(file.content.begin(), file.content.end());
    Mat img = imdecode(buffer, IMREAD_COLOR);

    if (img.empty()) {
      res.status = 500;
      res.set_content("{\"error\":\"opencv failed\"}", "application/json");
      return;
    }

    // Process image in memory
    Mat gray;
    cvtColor(img, gray, COLOR_BGR2GRAY);

    // imwrite("output.jpg", gray);

    res.set_content("{\"status\":\"ok\"}", "application/json");
  });

  cout << "Server running on http://0.0.0.0:8080\n";
  svr.listen("0.0.0.0", 8080);
}
