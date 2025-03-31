# Getting Started with Pet Feeder Machine

This guide will help you get started with the Pet Feeder Machine web application and hardware setup.

## Project Structure

The project is structured as follows:

- `src/components`: React components (Navbar, DeviceControlPanel, etc.)
- `src/context`: Context providers for authentication and device management
- `src/firebase`: Firebase configuration
- `src/pages`: Application pages (Home, Login, Dashboard, etc.)
- `ESP8266_PetFeeder`: Arduino code for the ESP8266 NodeMCU
- `tools`: Utility tools (QR code generator)

## Setup Instructions

### 1. Web Application Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Configure Firebase:

   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google providers)
   - Create a Firestore database
   - Get your Firebase configuration from Project Settings
   - Update the `src/firebase/config.js` file with your Firebase configuration:
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

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### 2. ESP8266 NodeMCU Setup

1. Hardware Requirements:

   - ESP8266 NodeMCU CP2102 WiFi Development Board
   - Servo Motor (SG90 or similar)
   - Jumper wires
   - Power supply (5V)
   - USB cable for programming
   - Pet food container with dispensing mechanism

2. Wiring:

   - Connect the servo's power wire (usually red) to VIN on the NodeMCU
   - Connect the servo's ground wire (usually brown or black) to GND on the NodeMCU
   - Connect the servo's signal wire (usually orange or yellow) to D4 (GPIO2) on the NodeMCU

3. Software Setup:

   - Install Arduino IDE
   - Add ESP8266 board support in Arduino IDE:
     - Go to File > Preferences
     - Add `http://arduino.esp8266.com/stable/package_esp8266com_index.json` to "Additional Boards Manager URLs"
     - Go to Tools > Board > Boards Manager
     - Search for ESP8266 and install
   - Install required libraries through Library Manager:
     - Firebase ESP8266 Client by Mobizt
     - ArduinoJson
     - Servo

4. Upload Code:
   - Open `ESP8266_PetFeeder/ESP8266_PetFeeder.ino` in Arduino IDE
   - Update the following settings:
     ```cpp
     #define API_KEY "YOUR_FIREBASE_API_KEY"
     #define DATABASE_URL "YOUR_FIREBASE_DATABASE_URL"
     #define WIFI_SSID "YOUR_WIFI_SSID"
     #define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"
     #define DEVICE_ID "PFM-1234-5678-90AB"  // Change this for each device
     ```
   - Select the correct board (NodeMCU 1.0)
   - Select the correct port
   - Upload the code

### 3. Generate QR Codes for Devices

1. Open the QR code generator:

   - Navigate to the `tools` directory
   - Open `generate_qr.html` in your browser

2. Enter the Device ID you set in the ESP8266 code

   - Format: `PFM-XXXX-XXXX-XXXX`
   - Click "Generate QR Code"

3. Download and print the QR code
   - Attach the QR code to your physical pet feeder device

### 4. Using the Application

1. Create an account:

   - Navigate to the Sign Up page
   - Create an account with email/password or Google

2. Add a device:

   - Go to the Dashboard
   - Click "Add Device" or "Scan QR Code"
   - Enter the Device ID or scan the QR code

3. Control your pet feeder:
   - Use the Touch Control to manually dispense food
   - Set up a timer for scheduled feeding

## Troubleshooting

### Web Application Issues

- **Firebase Connection Error**: Ensure your Firebase configuration is correct and the services (Auth, Firestore) are enabled.
- **Login Issues**: Check if you've properly set up Authentication providers in Firebase.

### ESP8266 Issues

- **WiFi Connection Error**: Double-check your WiFi credentials.
- **Firebase Connection Error**: Ensure the API key and database URL are correct.
- **Servo Not Moving**: Check the wiring and ensure the servo is getting power.

## Resources

- [React Documentation](https://react.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [ESP8266 Documentation](https://arduino-esp8266.readthedocs.io/en/latest/)
- [Arduino Servo Library](https://www.arduino.cc/reference/en/libraries/servo/)

## Support

For issues or feature requests, please contact support at support@petfeeder.com
