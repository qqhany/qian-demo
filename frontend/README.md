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

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
