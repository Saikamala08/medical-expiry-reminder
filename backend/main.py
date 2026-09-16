from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# PostgreSQL connection
def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="medical_expiry_db",
        user="postgres",
        password="sai_baba#123",
        port="5432"
    )


# Create users table
def create_users_table():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL
        );
    """)

    conn.commit()
    cursor.close()
    conn.close()


@app.on_event("startup")
def startup():
    create_users_table()


class LoginRequest(BaseModel):
    email: str
    password: str


@app.get("/")
def home():
    return {
        "message": "Medical Expiry Reminder System Backend is running!"
    }


@app.post("/login")
def login(request: LoginRequest):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE email = %s AND password = %s",
        (request.email, request.password)
    )

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user:
        return {
            "success": True,
            "message": "Login successful"
        }

    return {
        "success": False,
        "message": "Invalid email or password"
    }
