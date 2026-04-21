export const verifiedSuccessHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verified</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #8CCDEB;
      font-family: sans-serif;
    }
    .card {
      background-color: #FFE3A9;
      border-radius: 16px;
      padding: 48px 32px;
      max-width: 400px;
      width: 90%;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .icon { font-size: 64px; margin-bottom: 16px; }
    h1 { color: #0B1D51; font-size: 28px; font-weight: 700; margin-bottom: 12px; }
    p { color: #0B1D51; font-size: 15px; line-height: 1.6; margin-bottom: 24px; }
    .button {
      display: inline-block;
      background-color: white;
      color: #0B1D51;
      font-weight: 600;
      padding: 12px 32px;
      border-radius: 8px;
      text-decoration: none;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✅</div>
    <h1>Email Verified!</h1>
    <p>Your account has been successfully verified. You can now sign in to the app.</p>
    <a class="button" href="isdaok://signin">Open App</a>
  </div>
</body>
</html>
`;

export const verifiedFailHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verified</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #8CCDEB;
      font-family: sans-serif;
    }
    .card {
      background-color: #FFE3A9;
      border-radius: 16px;
      padding: 48px 32px;
      max-width: 400px;
      width: 90%;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .icon { font-size: 64px; margin-bottom: 16px; }
    h1 { color: #0B1D51; font-size: 28px; font-weight: 700; margin-bottom: 12px; }
    p { color: #0B1D51; font-size: 15px; line-height: 1.6; margin-bottom: 24px; }
    .button {
      display: inline-block;
      background-color: white;
      color: #0B1D51;
      font-weight: 600;
      padding: 12px 32px;
      border-radius: 8px;
      text-decoration: none;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">❌</div>
    <h1>Verification Failed</h1>
    <p>This link is invalid or has already expired. Please Request a new Verification Email</p>
  </div>
</body>
</html>
`;