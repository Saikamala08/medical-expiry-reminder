# Medical Expiry Reminder System 

A web-based application designed to manage medicine inventory, track expiry dates, and identify medicines that are safe, expiring soon, or already expired.

## Key Features

- **Dashboard:** Overview of total medicines and their expiry status.
- **Medicine Management:** Add, view, edit, and delete medicine records.
- **Expiry Tracking:** Classifies medicines as Safe, Expiring Soon, or Expired based on expiry dates.
- **Notifications:** Displays expiry-related information for medicines requiring attention.
- **Reports:** Shows inventory summaries and category-wise medicine distribution.
- **Settings:** Displays the expiry-alert threshold.
- **PostgreSQL Integration:** Stores medicine records persistently in a database.
- **REST API:** Connects the frontend and database through a FastAPI backend.

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Python, FastAPI
- **Database:** PostgreSQL
- **Database Connectivity:** Psycopg2
- **Tools:** Git, GitHub, Swagger UI

##  System Architecture

```text
React Frontend
      |
      | HTTP Requests
      v
FastAPI Backend
      |
      | SQL Queries
      v
PostgreSQL Database
```

## Getting Started

### Prerequisites

Install Python, Node.js, npm, and PostgreSQL.

### 1. Clone the Repository

```bash
git clone https://github.com/Saikamala08/medical-expiry-reminder.git
cd medical-expiry-reminder
```

### 2. Set Up the Backend

```bash
cd backend
python -m venv venv
```

Activate the environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install fastapi uvicorn psycopg2-binary
```

Configure PostgreSQL and set the required database connection environment variables, including `DB_PASSWORD`, before starting the backend.

Run:

```bash
uvicorn main:app --reload
```

API documentation: `http://127.0.0.1:8000/docs`

### 3. Set Up the Frontend

Open another terminal in the project root:

```bash
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

## Future Enhancements

- Automated email and SMS expiry alerts
- OCR-based medicine detail extraction
- Secure backend authentication
- Configurable expiry thresholds

## Note

This project is developed for academic purposes and demonstration. The current login uses demo credentials, and automated email/SMS notifications and OCR integration are not implemented.

##  Repository

[Medical Expiry Reminder System – GitHub](https://github.com/Saikamala08/medical-expiry-reminder)
