# Getting Started with Feedyx Pet Feeder

This guide will help you quickly set up and use your Feedyx Pet Feeder system.

## Quick Start Guide

### 1. Web Application Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Configure Firebase:

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Update `src/firebase/config.js` with your Firebase configuration:
     ```javascript
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID",
     };
     ```

3. Start the development server:

   ```
   npm run dev
   ```

4. Visit [http://localhost:5173](http://localhost:5173) in your browser

### 2. ESP8266 Hardware Assembly

1. Components needed:

   - ESP8266 NodeMCU development board
   - SG90 servo motor
   - Momentary push button
   - LED with 220-330Ω resistor
   - Jumper wires
   - 5V power supply
   - Pet food container

2. Wiring:

   - **Servo**: Connect RED→VIN, BLACK→GND, YELLOW→D2
   - **Button**: Connect one terminal→D1, other→GND
   - **LED**: Connect anode→D4 (with resistor), cathode→GND

3. Create a housing and attach servo to food container

### 3. ESP8266 Firmware Setup

1. Install required software and libraries:

   - Arduino IDE
   - ESP8266 board support
   - Libraries: FirebaseESP8266, ArduinoJson, ESP8266WiFi, NTPClient, TimeLib, Servo

2. Open and update `ESP8266_PetFeeder.ino`:

   - Set WiFi credentials:

     ```cpp
     #define PRIMARY_WIFI_SSID "YOUR_WIFI_SSID"
     #define PRIMARY_WIFI_PASSWORD "YOUR_WIFI_PASSWORD"
     #define SCAN_FOR_OPEN_NETWORKS true  // Set to false to disable auto-connect feature
     ```

   - Set Firebase credentials:

     ```cpp
     #define FIREBASE_HOST "your-project-id.firebaseio.com"
     #define FIREBASE_AUTH "YOUR_FIREBASE_DATABASE_SECRET"
     ```

   - Set your timezone (in seconds from UTC):

     ```cpp
     timeClient.setTimeOffset(19800);  // Example: +5:30 for India (5.5 hours * 3600 seconds)
     ```

   - Configure feeding settings:
     ```cpp
     #define CONTINUOUS_TIMER_FEEDING true  // Set to false to only feed at timer end
     #define FEEDING_INTERVAL 60000  // Feed every minute during timer (milliseconds)
     ```

3. Upload the firmware and note the device ID in the serial monitor

### 4. Registering Your Device

1. Create an account at [feedyx.onrender.com](https://feedyx.onrender.com)
2. Generate a QR code:

   - Navigate to the Tools section
   - Enter the device ID (format: PFM-XXXX-XXXX-XXXX)
   - Click "Generate QR Code" and download it
   - Attach the QR code to your physical feeder

3. Add the device to your account:
   - Click "Add Device" in the Dashboard
   - Scan the QR code or manually enter the Device ID
   - Give your device a name

## Using Your Pet Feeder

### Control Panel Features

1. **Touch Control**

   - Enables/disables the physical button on the device
   - When enabled, pressing the button dispenses food

2. **Timer Control**

   - **Standard Mode**: Sets a countdown timer that dispenses food when it expires
   - **Continuous Mode**: Dispenses food periodically from timer start until end
   - Input the number of minutes, then click "Start Timer"

3. **Schedule Control**
   - Set recurring feeding times for specific days of the week
   - Select day, time (in AM/PM format), and feeding duration
   - Toggle schedules active/inactive without deleting them
   - Edit durations by clicking on them
   - Schedules are automatically synchronized with the device

### Network Connectivity

Your pet feeder supports two connectivity methods:

1. **Primary WiFi**: Connects to your configured home network
2. **Open Network Fallback**: If primary network is unavailable, automatically connects to open networks

The device will maintain an internet connection whenever possible to ensure your pet is fed on schedule.

## Project Structure

- `src/components`: React components (Navbar, DeviceControlPanel, etc.)
- `src/context`: Context providers for authentication and device management
- `src/firebase`: Firebase configuration
- `src/pages`: Application pages (Home, Login, Dashboard, etc.)
- `src/styles`: CSS files for styling components
- `ESP8266_PetFeeder`: Arduino code for the ESP8266 NodeMCU
- `tools`: QR code generator tool

## Troubleshooting

### Web Application Issues

- **Firebase Connection Error**: Verify your Firebase configuration and services (Auth, Firestore) are enabled.
- **Login Issues**: Ensure Authentication providers are properly set up in Firebase.
- **UI Not Responsive**: Clear browser cache or try a different browser.

### ESP8266 Issues

- **WiFi Connection Error**: Check your WiFi credentials.
- **Firebase Connection Error**: Verify API key and database URL.
- **Servo Not Moving**: Check wiring and power supply.
- **Time/Schedule Issues**: Ensure timezone offset is set correctly.
- **Multiple Feeds**: Set `CONTINUOUS_TIMER_FEEDING` to false if unwanted.

### Feeding Issues

- **No Feeding on Schedule**: Check device time synchronization.
- **Food Jams**: Adjust the servo angles in the firmware if needed.
- **Battery Issues**: Ensure stable power supply for reliable operation.

## Resources

- [Full Documentation](https://github.com/yourusername/pet-feeder-machine#readme)
- [Firebase Documentation](https://firebase.google.com/docs)
- [ESP8266 Documentation](https://arduino-esp8266.readthedocs.io/en/latest/)
- [React Documentation](https://react.dev/)

## Support

For issues or feature requests, please contact support@feedyx.com or open an issue on GitHub.
