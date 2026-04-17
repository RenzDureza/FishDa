#include <iostream>
#include <fstream>
#include <random>
#include <string>

using namespace std;

random_device rd;
mt19937 gen(rd());

double randDouble(double min, double max) {
    uniform_real_distribution<> dis(min, max);
    return dis(gen);
}

int randInt(int min, int max) {
    uniform_int_distribution<> dis(min, max);
    return dis(gen);
}

string generateLabel(double eye_clarity, double eye_red, double scale_damage) {
    if (eye_clarity > 0.8 && eye_red < 0.15 && scale_damage < 0.1)
        return "high";
    else if (eye_clarity > 0.6 && eye_red < 0.3)
        return "mid";
    else
        return "low";
}

void generateFish(ofstream &file, int species, int count) {
    for (int i = 0; i < count; i++) {
        double eye_clarity = randDouble(0.4, 1.0);
        double eye_red = randDouble(0.05, 0.6);
        int gill_hue = randInt(0, 360);
        double gill_sat = randDouble(0.3, 0.95);
        int body_color = randInt(140, 220);
        double body_shine = randDouble(0.3, 0.9);
        double scale_damage = randDouble(0.02, 0.5);
        double tail_damage = randDouble(0.02, 0.5);

        string label = generateLabel(eye_clarity, eye_red, scale_damage);

        file << eye_clarity << ","
             << eye_red << ","
             << gill_hue << ","
             << gill_sat << ","
             << body_color << ","
             << body_shine << ","
             << scale_damage << ","
             << tail_damage << ","
             << species << ","
             << label << "\n";
    }
}

int main() {
    ofstream file("fish_dataset.csv");

    file << "eye_clarity,eye_red_ratio,gill_hue,gill_saturation,body_color,body_shine,scale_damage,tail_damage,fish_species,label\n";

    generateFish(file, 0, 120);
    generateFish(file, 1, 120);
    generateFish(file, 2, 120);

    file.close();

    cout << "Dataset generated: fish_dataset.csv\n";
    return 0;
}