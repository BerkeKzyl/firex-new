# FireX - Wildfire Monitoring System

FireX is a comprehensive wildfire monitoring and early warning system that combines web, mobile, and IoT components to provide real-time wildfire detection and monitoring capabilities.

## 🌟 Features

### Web Platform
- Interactive map interface for real-time wildfire monitoring
- Detailed wildfire reports and analytics
- Admin dashboard for system management
- Real-time sensor data visualization
- User authentication and role-based access control

### Mobile Application (iOS)
- Real-time wildfire map with location tracking
- Wildfire reporting functionality
- User profile management
- Leaf recognition for vegetation analysis
- Push notifications for nearby wildfire alerts

### Backend System
- RESTful API architecture
- JWT-based authentication
- Real-time data processing
- MongoDB database integration
- Sensor data management

### IoT Components
- Raspberry Pi-based sensor network
- Environmental monitoring:
  - Temperature and humidity (DHT22)
  - Air quality (MQ-9)
  - GPS location tracking
- Real-time data transmission

## 🛠️ Technology Stack

### Web Application
- Next.js
- TypeScript
- Tailwind CSS
- Mapbox/Google Maps API
- JWT Authentication

### Mobile Application
- Swift
- iOS Native Components
- Core ML for leaf recognition
- MapKit for mapping
- Push Notifications

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- WebSocket for real-time updates

### IoT
- Raspberry Pi
- Python
- DHT22 Sensor
- MQ-9 Sensor
- GPS Module

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Xcode (for iOS development)
- Python 3.8+ (for IoT components)
- Raspberry Pi (for sensor deployment)

### Web Application Setup
```bash
cd firex-new
npm install
npm run dev
```

### iOS Application Setup
1. Open `FireXIOS/FireXIOS.xcodeproj` in Xcode
2. Install dependencies using CocoaPods
3. Build and run the application

### Backend Setup
```bash
cd firex-new
npm install
npm run build
npm start
```

### IoT Setup
```bash
# Install required Python packages
pip install -r requirements.txt

# Configure sensor settings
python configure_sensors.py
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the `firex-new` directory with the following variables:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
MAPBOX_API_KEY=your_mapbox_key
```

### Sensor Configuration
Configure sensor settings in `firex-new/config.json`:
```json
{
  "sensors": {
    "dht22": {
      "pin": 4,
      "interval": 300
    },
    "mq9": {
      "pin": 17,
      "interval": 60
    },
    "gps": {
      "port": "/dev/ttyAMA0",
      "baudrate": 9600
    }
  }
}
```

## 📊 Sample Data

The system includes sample data for testing and development:

### Wildfire Reports
```json
{
  "id": "WF001",
  "location": {
    "lat": 37.7749,
    "lng": -122.4194
  },
  "severity": "high",
  "status": "active",
  "timestamp": "2024-03-20T10:00:00Z"
}
```

### Sensor Readings
```json
{
  "sensor_id": "SENSOR001",
  "readings": {
    "temperature": 25.5,
    "humidity": 45.2,
    "air_quality": 120,
    "location": {
      "lat": 37.7749,
      "lng": -122.4194
    }
  },
  "timestamp": "2024-03-20T10:00:00Z"
}
```

## 🔐 Security

- JWT-based authentication
- HTTPS encryption
- Role-based access control
- Secure sensor data transmission
- Regular security audits

## 📱 Mobile App Screenshots

[Placeholder for mobile app screenshots]

## 🖥️ Web Interface Screenshots

[Placeholder for web interface screenshots]

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@firex.com or join our Slack channel.

## 🙏 Acknowledgments

- [List of contributors and acknowledgments]
- [Any third-party libraries or tools used] 