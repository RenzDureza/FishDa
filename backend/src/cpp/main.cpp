#include "httplib.h"
#include <iostream>
#include <opencv2/opencv.hpp>

using namespace std;
using namespace cv;
using namespace httplib;

int main() {
  Server svr;

  svr.Get("/hi", [](const Request &, Response &res) {
    res.set_content("Hello World!", "text/plain");
  });

	cout << "main.cpp is listen at port: 8081" << endl;
  svr.listen("0.0.0.0", 8081);
}
