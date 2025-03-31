# Pet Feeder Machine

A web application for controlling smart pet feeder devices remotely. This application allows users to manage their pet feeder devices, control feeding schedules, and monitor their pets' feeding activities.

## Features

- User authentication (email/password and Google login)
- Dashboard for managing multiple pet feeder devices
- Remote control of pet feeder devices
- Timer-based feeding schedules
- QR code scanner for easy device pairing
- Responsive design for desktop and mobile devices

## Tech Stack

- Frontend: React.js with Vite
- Authentication & Database: Firebase
- Styling: Styled Components
- Icons: React Icons
- QR Code Scanning: HTML5-QRCode

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

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

To set up your ESP8266 NodeMCU CP2102 WiFi Development Board with a servo motor for the pet feeder:

1. Hardware Requirements:

   - ESP8266 NodeMCU CP2102 WiFi Development Board
   - Servo Motor (SG90 or similar)
   - Jumper wires
   - Power supply (5V)
   - USB cable for programming

2. Wiring:

   - Connect the servo's power wire (usually red) to VIN on the NodeMCU
   - Connect the servo's ground wire (usually brown or black) to GND on the NodeMCU
   - Connect the servo's signal wire (usually orange or yellow) to D4 (GPIO2) on the NodeMCU

3. Software Setup:

   - Install Arduino IDE
   - Add ESP8266 board support in Arduino IDE
   - Install required libraries:
     - Firebase ESP8266 Client
     - ArduinoJson
     - ESP8266WiFi
     - Servo

4. ESP8266 Code:

   - The NodeMCU firmware should connect to WiFi and Firebase
   - Listen for commands from the Firebase database
   - Control the servo motor based on received commands
   - Report device status back to Firebase

5. Generate Device ID:
   - Each device should have a unique ID (generated during firmware upload)
   - Device IDs are used to link devices to user accounts
   - QR codes can be generated from device IDs using online tools

## Firebase Structure

The application uses the following Firebase structure:

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
        active: boolean
      }
    - lastFed: timestamp
    - createdAt: timestamp
```

## Deployment

This application can be deployed using Firebase Hosting:

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
