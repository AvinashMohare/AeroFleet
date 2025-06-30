# AeroFleet

**AeroFleet** is a powerful web application for managing drones, operators, and missions within an organization. It features role-based dashboards, live mission monitoring, and secure authentication.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Project Structure](#project-structure)
- [API Overview](#api-overview)
- [Usage Guide](#usage-guide)
- [Development Notes](#development-notes)
- [Future Improvements](#future-improvements)

---

## 🚀 Features

### 👨‍✈️ Admin Dashboard
- View summary of drones and missions
- Add, view, and manage drones
- Create missions
- Monitor all drones and missions

### 👷 Operator Dashboard
- View assigned drone
- See missions assigned to that drone
- Access live mission feed

### 📡 Mission Live Feed
- Real-time (mocked) mission updates
- Map visualization of area, waypoints, and drone position
- Live video stream (mock/demo)
- Download sensor data as Excel (mocked)

### 🔐 Authentication
- JWT-based login/signup
- Role-based access control for admin and operators

---

## 🛠 Tech Stack

- **Frontend**: React, Material-UI  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (Mongoose ODM)  
- **Authentication**: JWT  
- **Other Tools**:  
  - Socket.io *(for real-time features)*  
  - XLSX *(Excel export)*  
  - Leaflet *(map visualization)*  

---

## 🧰 Setup & Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or cloud)

### Clone the Repository
```bash
git clone https://github.com/AvinashMohare/AeroFleet.git
cd AeroFleet
```

### Backend Setup
```bash
cd server
npm install
# Create .env file and add:
# MONGODB_URI=<your-mongodb-uri>
# JWT_SECRET=<your-secret-key>
node server.js   # or use: nodemon server.js
```

### Frontend Setup
```bash
cd ../client
npm install
# Edit src/constants.js and update BASE_URL to point to your backend API
npm start
```

---

## 📁 Project Structure

```
AeroFleet/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routesConfig.js
│   │   └── ...
├── server/                 # Node.js backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── mockMissionFeed.js
│   └── server.js
```

---

## 🔌 API Overview

### 🔑 Authentication
- `POST /api/login` — Login (returns JWT)
- `POST /api/signup` — Signup

### 🛸 Drones
- `POST /api/drones` — Create a new drone
- `GET /api/drones` — List all drones
- `GET /api/drones/assigned-drone` — Get operator's assigned drone
- `GET /api/drones/:droneId` — Get drone details
- `POST /api/drones/:droneId/assign-operator` — Assign an operator to a drone

### 📍 Missions
- `POST /api/missions` — Create a new mission
- `GET /api/missions` — List all missions
- `GET /api/get-missions` — Get missions (with optional drone filter)
- `GET /api/missions/:id` — Get mission details

### 👥 Users
- `GET /api/users` — List all operators

### 📊 Dashboard
- `GET /api/dashboard/admin-dashboard` — Get data for admin dashboard

---

## 📖 Usage Guide

### 1. Signup/Login
- Both admins and operators can sign up and log in via the frontend interface.

### 2. Admin Actions
- Add drones
- Assign drones to operators
- Create and manage missions
- View mission progress and drone statuses in real-time

### 3. Operator Actions
- View assigned drone and related missions
- Access live feed for selected missions

### 4. Live Feed View
- Real-time updates (mocked)
- Map view with waypoints and drone positions
- Download mission data in Excel format (mocked)
- Stream demo video feed

---

## 🧪 Development Notes

- **Mock Data**:  
  - Mission updates, video, and sensor data are mocked for testing purposes.

- **Security**:  
  - All protected routes require a valid JWT.
  - Role-based access ensures secure actions for admin and operator.

- **Extensibility**:  
  - The codebase is modular and ready for:
    - Real drone API integration
    - Real-time features using Socket.io

---

## 🌟 Future Improvements

- 🔗 Real drone telemetry integration
- 📡 Real-time mission updates via Socket.io
- 🧭 Advanced mission planning (crosshatch, perimeter, etc.)
- 📈 Analytics and reporting dashboards
- 🚨 Improved error handling and form validations

---

[📄 Documentation](https://drive.google.com/file/d/1Zh1FBhSVIdSuUNmagvbPDEcBsAkwpjcZ/view?usp=sharing)

[🧠 Brief write-up](https://drive.google.com/file/d/1A4OcH0FjYmrn0JHVcQWlIR4Rw6N2rWLL/view?usp=sharing)

---

## 📬 Contributing

Feel free to open issues or submit pull requests to improve AeroFleet. All contributions are welcome!

---

## ✈️ Made with 💻 by [Avinash Mohare](https://github.com/AvinashMohare)
