# IsdaOK
- A fish quality assessment app that relies on classical image processing techniques only.

## How to Clone:
1. Install dependencies:
    - [Node.js + npm](https://nodejs.org/en/download/current)
    - [MySQL](https://dev.mysql.com/downloads/workbench/)
    - Expo CLI: `npm install -g expo-cli`.
    - [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en)
2. Clone the repo: `git clone https://github.com/RenzDureza/FishDa.git`.
3. Open a terminal inside the repository.
4. Navigate to the frontend folder: `cd frontend`.
5. Install frontend dependencies: `npm install`.
4. Go back and navigate to the backend folder: `cd ../backend`.
5. Install backend dependencies: `npm install`.
6. Create a `.env` file inside the backend folder.

***

## How to run the Frontend:
1. Inside the repository, navigate to the frontend directory: `cd frontend`.
2. Start the development server: `npx expo start`.
3. Upon starting, a QR code will be generated, scan it with your Expo Go application to start the build on your phone.

***

## How to start the Database:
1. not sure pano sa windows, aaralin ko pa.

***

## How to run the Backend:
1. Inside the repository, navigate to the backend directory: `cd backend`.
2. Start the server: `npm run dev`.

***

## How to run Python File:
1. python -m uvicorn main:app --reload

***

## EYES
eye_clarity
edge_density
eyes_redness
OVERALL_EYES

## GILLS
    gills_hue
    gills_saturation
    gills_value
OVERALL_GILLS

## BODY
    shine_coverage
    shine_average
    body_hue
    body_saturation
    body_value
    ? body damage
OVERALL_BODY

## TAIL
    ? tail damage
OVERALL_TAIL

## ML
OVERALL_SCORE