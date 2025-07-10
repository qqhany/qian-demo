# Vehicle Insurance Quote App

This is a full-stack demo application for vehicle insurance quotes, built with Expo (React Native) for the frontend and Node.js for the backend.

## Features
- User login (local and GitHub OAuth)
- Get instant vehicle insurance quotes
- View quote details and purchase insurance
- Logout functionality
- Responsive UI for web and mobile (Expo Go)

## How to Test
1. **Start the backend**
   - Go to the `backend` directory and run:
     ```bash
     npm install
     node server.js
     ```
   - Make sure the backend is running and accessible from your device (use your LAN IP, not localhost).

2. **Start the frontend**
   - In the `frontend` directory, run:
     ```bash
     npm install
     npx expo start
     ```
   - Open the app in your browser, iOS/Android simulator, or Expo Go app.

3. **Test the app**
   - Login with the test account (Username: `test`, Password: `123456`)
   - Try getting quotes, viewing details, purchasing, and logging out.

---
