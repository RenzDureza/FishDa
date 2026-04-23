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

export const resetPasswordHTML = (token, baseUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Password</title>
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
    input {
      width: 100%;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid #ccc;
      margin-bottom: 12px;
      font-size: 15px;
    }
    button {
      width: 100%;
      background-color: #0B1D51;
      color: white;
      font-weight: 600;
      padding: 12px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-size: 15px;
    }
    .message { margin-top: 12px; font-size: 14px; }
    .success { color: green; }
    .error { color: red; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🔒</div>
    <h1>Reset Password</h1>
    <p>Enter your new password below.</p>
    <input type="password" id="password" placeholder="New password" />
    <input type="password" id="confirmPassword" placeholder="Confirm new password" />
    <button onclick="resetPassword()">Reset Password</button>
    <p class="message" id="message"></p>
  </div>

  <script>
    async function resetPassword() {
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const message = document.getElementById('message');

      if (!password || !confirmPassword) {
        message.className = 'message error';
        message.textContent = 'All fields are required.';
        return;
      }

      if (password !== confirmPassword) {
        message.className = 'message error';
        message.textContent = 'Passwords do not match.';
        return;
      }

      try {
        const res = await fetch('${baseUrl}/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: '${token}', newPassword: password })
        });

        if (res.ok) {
          const html = await res.text();
          document.open();
          document.write(html);
          document.close();
        } else {
          const data = await res.json();
          message.className = 'message error';
          message.textContent = data.message || 'Something went wrong.';
        }
      } catch (err) {
        message.className = 'message error';
        message.textContent = 'Network error. Please try again.';
      }
    }
  </script>
</body>
</html>
`;

export const resetSuccessHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset</title>
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
    <h1>Password Reset!</h1>
    <p>Your password has been successfully reset. You can now sign in.</p>
    <a class="button" href="isdaok://signin">Open App</a>
  </div>
</body>
</html>
`;