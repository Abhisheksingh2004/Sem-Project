# Feedyx - Smart Pet Feeder Machine

A comprehensive IoT solution for controlling smart pet feeder devices remotely. This web application allows users to manage multiple pet feeder devices, control feeding schedules, and monitor their pets' feeding activities from anywhere in the world.

**Live Demo:** [feedyx.onrender.com](https://feedyx.onrender.com)

## Features

- **User Authentication**

  - Email/password and Google login
  - Secure user account management
  - Device ownership tracking

- **Device Management**

  - Dashboard for managing multiple feeder devices
  - Unique device ID generation from MAC address
  - QR code scanner for easy device pairing

- **Feeding Controls**

  - Touch Control: Trigger immediate feeding remotely
  - Timer Control: Two modes available
    - Standard: Feed when timer ends
    - Continuous: Feed periodically during timer duration
  - Schedule Control: Set recurring feedings with day and time selection
  - AM/PM time format with user-friendly selection
  - Customizable feeding durations
  - Manual feeding via physical button on device

- **Network Connectivity**

  - Primary WiFi network connection
  - Automatic fallback to open networks when primary is unavailable
  - Automatic reconnection if connection is lost

- **Interface**
  - Clean, modern UI with responsive design
  - Dedicated control panels for each device
  - Feeding history tracking
  - Real-time status updates

## Tech Stack

- **Frontend**:

  - React.js with Vite
  - Styled Components
  - CSS modules for component styling
  - React Icons
  - Responsive mobile-first design

- **Backend**:

  - Firebase Authentication
  - Firebase Firestore Database
  - Firebase Security Rules
  - Real-time data synchronization

- **Hardware**:

  - ESP8266 NodeMCU microcontroller
  - Servo motor for food dispensing
  - NTP for time synchronization
  - Physical control button and status LED

- **Tools**:
  - QR Code Generator and Scanner
  - HTML5-QRCode library
  - Deployment on Render.com

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Arduino IDE (for ESP8266 firmware)

### Web Application Setup

1. Clone the repository

   ```
   git clone <repository-url>
   cd pet-feeder-machine
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Configure Firebase

   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google providers)
   - Create a Firestore database
   - Get your Firebase configuration from Project Settings
   - Update the `src/firebase/config.js` file with your Firebase configuration

4. Start the development server
   ```
   npm run dev
   ```

## ESP8266 NodeMCU Setup

### Hardware Requirements

- ESP8266 NodeMCU CP2102 WiFi Development Board
- Servo Motor (SG90 or similar)
- Momentary push button
- Status LED (any color)
- 220-330 ohm resistor (for LED)
- Jumper wires
- Power supply (5V)
- Pet food container with dispensing mechanism

### Wiring

- **Servo Motor**:

  - RED wire → VIN on NodeMCU (5V power)
  - BROWN/BLACK wire → GND on NodeMCU
  - ORANGE/YELLOW wire → D2 pin on NodeMCU (signal)

- **Push Button**:

  - One terminal → D1 pin on NodeMCU
  - Other terminal → GND on NodeMCU

- **Status LED**:
  - Anode (longer leg) → D4 pin through a 220-330 ohm resistor
  - Cathode (shorter leg) → GND on NodeMCU

### Software Setup

1. Install Arduino IDE
2. Add ESP8266 board support:

   - Go to File > Preferences
   - Add `http://arduino.esp8266.com/stable/package_esp8266com_index.json` to "Additional Boards Manager URLs"
   - Go to Tools > Board > Boards Manager
   - Search for ESP8266 and install

3. Install required libraries:

   - FirebaseESP8266 by Mobizt
   - ArduinoJson
   - ESP8266WiFi
   - NTPClient
   - TimeLib
   - Servo

4. Open `ESP8266_PetFeeder/ESP8266_PetFeeder.ino` in Arduino IDE

5. Update the configuration section:

   ```cpp
   // WiFi credentials
   #define PRIMARY_WIFI_SSID "YOUR_WIFI_SSID"
   #define PRIMARY_WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

   // Firebase credentials
   #define FIREBASE_HOST "your-project-id.firebaseio.com"
   #define FIREBASE_AUTH "YOUR_FIREBASE_DATABASE_SECRET"

   // Timezone offset (in seconds)
   timeClient.setTimeOffset(0);  // Adjust based on your location
   ```

6. Customize feeding settings if needed:

   ```cpp
   // Feeding settings
   #define CONTINUOUS_TIMER_FEEDING true  // Set to false to only feed at timer end
   #define FEEDING_INTERVAL 60000  // Feed every minute during timer (in milliseconds)
   ```

7. Upload the firmware to your ESP8266 device

### Setting Up Your Pet Feeder

1. Create a suitable housing for the electronics
2. Attach the servo to control the food dispensing mechanism
3. Ensure the button is accessible for manual feeding
4. Position the LED so it's visible during operation
5. Secure all components to prevent damage from pets or food

## Device Registration

1. Power on your assembled pet feeder
2. Check the serial monitor in Arduino IDE to see the unique device ID
3. Use the QR code generator tool in the web application to create a QR code for your device
4. In the Feedyx web app, scan the QR code or manually enter the device ID
5. Your device is now linked to your account and can be controlled through the application

## Firebase Structure

```
- users/
  - {userId}/
    - email: string
    - createdAt: timestamp
    - devices: array of deviceIds
- devices/
  - {deviceId}/
    - name: string
    - status: string (active/inactive)
    - touchControl: boolean
    - timerSettings: {
        minutes: number,
        active: boolean,
        startTime: timestamp
      }
    - schedules: [
        {
          day: string (Monday-Sunday),
          time: string (format: "HH:MM AM/PM"),
          time24h: string (format: "HH:MM"),
          duration: number (seconds),
          enabled: boolean
        }
      ]
    - lastFed: timestamp
    - createdAt: timestamp
```

## Deployment

The web application is currently deployed at [feedyx.onrender.com](https://feedyx.onrender.com).

To deploy your own instance:

1. Create an account on [Render](https://render.com)
2. Connect your GitHub repository
3. Create a new Web Service with these settings:
   - Build Command: `npm run build`
   - Start Command: `npm run start`
   - Environment Variables: Set up your Firebase configuration

Alternative deployment with Firebase Hosting:

1. Install Firebase CLI

   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase

   ```
   firebase login
   ```

3. Initialize Firebase Hosting

   ```
   firebase init hosting
   ```

4. Build the application

   ```
   npm run build
   ```

5. Deploy to Firebase
   ```
   firebase deploy
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Firebase](https://firebase.google.com/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [ESP8266 Community](https://esp8266.com/)
- [Render](https://render.com/) for hosting
