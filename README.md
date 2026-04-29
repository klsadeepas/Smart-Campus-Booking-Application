# Smart-Campus-Booking-Application
The system is designed to streamline and manage university operations efficiently, including facility and resource bookings, 
incident management, and user notifications.

## 🚀 Features

### Student & Staff Features
- **User Authentication**: Register, Login, JWT-based authentication
- **Resources Browsing**: Browse available campus rooms (lecture halls, labs, meeting rooms, study rooms)
- **Room Selection & Configuration**: Choose room preferences
- **Booking Cart**: Add room bookings, manage selected time slots, edit or remove reservations before confirmation
- **Checkout**: Date & time selection, Approval request submission
- **Booking Tracking**: Real-time booking status tracking
- **User Dashboard**: Booking history, Profile management, Cancel or reschedule bookings
- **Room Availability Calendar**: View real-time availability of rooms in calendar format
- **Notifications & Alerts**: Booking approval/rejection, Admin announcements

### Admin Features
- **Dashboard**: Total bookings, Most frequently booked rooms, Pending approval requests
- **Booking Management**: View booking details (room, user, time slot, purpose)
- **Room Management**: Add, edit, and delete campus rooms with full configuration
- **User Management**: View and manage system users (students, lecturers, admins)
- **Schedule & Time Slot Management**: Create standard time slots for rooms
- **Approval Workflow Management**: Auto-approve or manual approval settings
- **Notification Management**: Booking confirmations and rejections
- **Room Maintenance Management**: Track and manage room status

## 🛠️ Tech Stack

### Backend
- **Spring Boot** - backend framework for building RESTful APIs
- **Spring Security** - Authentication & authorization
- **MongoDB** - Database (Mongoose ODM)
- **JWT** - Authentication
- **Maven / Gradle** - Dependency and build management

### Frontend
- **React 18** - UI library
- **React Router DOM 6** - Client-side routing
- **Redux Toolkit** - State management
- **Tailwind CSS** - Modern utility-first styling framework
- **Framer Motion** - Animations
- **React Icons** - Icon library
- **React Toastify** - Notifications
- **Chart.js** - Analytics charts

## 🔑 Demo Credentials

### Admin Account
- Email: admin1@gmail.com
- Password: admin123

### User Account
- Email: student1@example.com
- Password: student123

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Product
- `GET /api/resources` - Get all resources
- `GET /api/resources/:id` - Get resources by ID
- `POST /api/resources` - Create resources (admin)
- `PUT /api/resources/:id` - Update resources (admin)
- `DELETE /api/resources/:id` - Delete resources (admin)

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get users by ID

## 📄 License

This project is for educational purposes.

# Screenshot of web application

## Image 1

![image alt](https://github.com/klsadeepas/Smart-Campus-Booking-Application/blob/d39d2525e683cc15839f4ca0f345a35541532885/images/1.png)

## Image 2

![image alt](https://github.com/klsadeepas/Smart-Campus-Booking-Application/blob/d39d2525e683cc15839f4ca0f345a35541532885/images/2.png)

## Image 3

![image alt](https://github.com/klsadeepas/Smart-Campus-Booking-Application/blob/d39d2525e683cc15839f4ca0f345a35541532885/images/3.png)

## Image 4
![image alt](https://github.com/klsadeepas/Smart-Campus-Booking-Application/blob/d39d2525e683cc15839f4ca0f345a35541532885/images/4.png)

## Image 5

![image alt](https://github.com/klsadeepas/Smart-Campus-Booking-Application/blob/d39d2525e683cc15839f4ca0f345a35541532885/images/5.png)

## Image 6

![image alt](https://github.com/klsadeepas/Smart-Campus-Booking-Application/blob/d39d2525e683cc15839f4ca0f345a35541532885/images/6.png)

## Image 7

![image alt](https://github.com/klsadeepas/Smart-Campus-Booking-Application/blob/d39d2525e683cc15839f4ca0f345a35541532885/images/7.png)

## Image 8

![image alt](https://github.com/klsadeepas/Smart-Campus-Booking-Application/blob/d39d2525e683cc15839f4ca0f345a35541532885/images/8.png)

## Image 9

![image alt](https://github.com/klsadeepas/Smart-Campus-Booking-Application/blob/d39d2525e683cc15839f4ca0f345a35541532885/images/9.png)

## Image 10

![image alt](https://github.com/klsadeepas/Smart-Campus-Booking-Application/blob/d39d2525e683cc15839f4ca0f345a35541532885/images/10.png)

## Image 11

![image alt](https://github.com/klsadeepas/Smart-Campus-Booking-Application/blob/d39d2525e683cc15839f4ca0f345a35541532885/images/11.png)



