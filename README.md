# **Bookworm**
**A library management system designed to streamline book lending, return tracking, and notifications.**

---

## **Table of Contents**
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Contributing](#contributing)

---

## **Introduction**
Bookworm is a comprehensive library management system aimed at simplifying the management of library resources, book lending, and returns. It integrates Redis and Celery for efficient daily reminders and email notifications. The application is built using **Python**, **Vue.js**, **Redis**, and **Celery**, offering a smooth and dynamic experience for both library staff and users.

---

## **Features**
- **Book Lending & Return**: Seamless tracking of books borrowed and returned by users.
- **Daily Reminders**: Automated reminders for overdue books using Redis and Celery.
- **Email Notifications**: Instant email notifications for book returns and overdue alerts.
- **Search and Filter**: Easily search for books using multiple filters.
- **User-friendly Interface**: Responsive frontend built with Vue.js to enhance the user experience.

---

## **Tech Stack**
### **Backend**
- **Python**: Core application logic.
- **Flask**: Web framework for building the backend API and managing requests.
- **Redis**: In-memory data store used for managing user sessions and daily reminders.
- **Celery**: Distributed task queue for handling asynchronous operations like sending notifications.
  
### **Frontend**
- **Vue.js**: Dynamic frontend framework for a responsive and user-friendly interface.

### **Database**
- **SQLite**: Lightweight relational database for persistent storage.

### **Other Tools**
- **HTML/CSS**: Basic structure and styling for the frontend.

---

## **Setup and Installation**

### **Prerequisites**
- Python 3.x
- Node.js (for Vue.js)
- Redis server (for notifications and session management)

### **Installation**
1. **Clone the repository**:  
   ```bash
   git clone https://github.com/yourusername/bookworm.git
   cd bookworm
   ```

2. **Install Python dependencies**:  
   Make sure you have `pip` installed. Then run:  
   ```bash
   pip install -r requirements.txt
   ```

3. **Install frontend dependencies**:  
   Navigate to the `frontend` directory and run:  
   ```bash
   npm install
   ```

4. **Setup Redis**:  
   Make sure Redis is installed and running on your machine. If not, follow the [Redis installation guide](https://redis.io/docs/getting-started/).

5. **Run the application**:
   - Start the backend server:
     ```bash
     python app.py
     ```
   - Start the Vue.js development server:
     ```bash
     npm run serve
     ```

6. **Access the system**:  
   Once the application is running, you can access the library management system at:
   - Backend: `http://127.0.0.1:5000`
   - Frontend: `http://localhost:8080`

---

## **Usage**
- **Librarians** can log in to manage books, check the status of book lending, and send reminders for overdue books.
- Librarians can use the integrated chart feature to view trending books and top users.
- **Users** can browse available books, borrow or return them, and receive email notifications.

---

## **Contributing**
We welcome contributions! If you'd like to contribute to **Bookworm**, please fork the repository, make your changes, and submit a pull request.

Steps to contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

---
