import os
from datetime import date
from typing import Optional

import psycopg2
from psycopg2.extras import RealDictCursor
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Medical Expiry Reminder System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db_connection():
    password = os.getenv("DB_PASSWORD")
    if not password:
        raise RuntimeError(
            "DB_PASSWORD is not set. Set it in the same terminal before starting FastAPI."
        )

    return psycopg2.connect(
        host="localhost",
        database="medical_expiry_db",
        user="postgres",
        password=password,
        port="5432",
    )


def create_users_table():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password VARCHAR(100) NOT NULL
                );
            """)
            # Preserve notes entered through the existing React form.
            cursor.execute("""
                ALTER TABLE medicines
                ADD COLUMN IF NOT EXISTS notes TEXT;
            """)
        conn.commit()
    finally:
        conn.close()


@app.on_event("startup")
def startup():
    create_users_table()


class LoginRequest(BaseModel):
    email: str
    password: str


class MedicineCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    category: Optional[str] = None
    batch_number: Optional[str] = None
    quantity: int = Field(ge=0)
    manufacturing_date: Optional[date] = None
    expiry_date: date
    notes: Optional[str] = None


@app.get("/")
def home():
    return {"message": "Medical Expiry Reminder System Backend is running!"}


@app.post("/login")
def login(request: LoginRequest):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT id FROM users WHERE email = %s AND password = %s",
                (request.email, request.password),
            )
            user = cursor.fetchone()

        if user:
            return {"success": True, "message": "Login successful"}
        return {"success": False, "message": "Invalid email or password"}
    finally:
        conn.close()


@app.get("/medicines")
def get_medicines():
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT id, name, category, batch_number, quantity,
                       manufacturing_date, expiry_date, notes, created_at
                FROM medicines
                ORDER BY id
            """)
            return cursor.fetchall()
    finally:
        conn.close()


@app.post("/medicines", status_code=201)
def add_medicine(medicine: MedicineCreate):
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                INSERT INTO medicines
                    (name, category, batch_number, quantity,
                     manufacturing_date, expiry_date, notes)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id, name, category, batch_number, quantity,
                          manufacturing_date, expiry_date, notes, created_at
            """, (
                medicine.name,
                medicine.category,
                medicine.batch_number,
                medicine.quantity,
                medicine.manufacturing_date,
                medicine.expiry_date,
                medicine.notes,
            ))
            result = cursor.fetchone()
            conn.commit()
            return result
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


@app.put("/medicines/{medicine_id}")
def update_medicine(medicine_id: int, medicine: MedicineCreate):
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                UPDATE medicines
                SET name = %s,
                    category = %s,
                    batch_number = %s,
                    quantity = %s,
                    manufacturing_date = %s,
                    expiry_date = %s,
                    notes = %s
                WHERE id = %s
                RETURNING id, name, category, batch_number, quantity,
                          manufacturing_date, expiry_date, notes, created_at
            """, (
                medicine.name,
                medicine.category,
                medicine.batch_number,
                medicine.quantity,
                medicine.manufacturing_date,
                medicine.expiry_date,
                medicine.notes,
                medicine_id,
            ))
            result = cursor.fetchone()

            if result is None:
                raise HTTPException(status_code=404, detail="Medicine not found")

            conn.commit()
            return result
    except HTTPException:
        conn.rollback()
        raise
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


@app.delete("/medicines/{medicine_id}")
def delete_medicine(medicine_id: int):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "DELETE FROM medicines WHERE id = %s RETURNING id",
                (medicine_id,),
            )
            deleted = cursor.fetchone()

            if deleted is None:
                raise HTTPException(status_code=404, detail="Medicine not found")

            conn.commit()
            return {
                "success": True,
                "message": "Medicine deleted successfully",
                "id": deleted[0],
            }
    except HTTPException:
        conn.rollback()
        raise
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
