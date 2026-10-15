"""
Shivang Pandey - Developer Portfolio API (FastAPI)
Full-Stack Web Developer & Python Backend Specialist
"""

from datetime import datetime, timezone
import html
import json
import os
from pathlib import Path
from typing import List, Optional
import urllib.request

from fastapi import BackgroundTasks, FastAPI, HTTPException, Header, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr, Field

# Root directory of the repository
PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Lightweight zero-dependency .env loader for local development
def load_dotenv_file():
    env_file = PROJECT_ROOT / ".env"
    if env_file.exists():
        try:
            with open(env_file, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith("#") or "=" not in line:
                        continue
                    k, v = line.split("=", 1)
                    k, v = k.strip(), v.strip().strip("'\"")
                    if k and k not in os.environ:
                        os.environ[k] = v
        except Exception:
            pass

load_dotenv_file()

# Initialize FastAPI App with OpenAPI metadata
app = FastAPI(
    title="Shivang Pandey | Portfolio API",
    description=(
        "Production-ready FastAPI backend for Shivang Pandey's Developer Portfolio. "
        "Provides REST endpoints for contact form inquiries, project information, and system health status."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class ContactMessage(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Full name or company name")
    email: EmailStr = Field(..., description="Valid contact email address")
    message: str = Field(..., min_length=5, max_length=5000, description="Project requirements or message")

class ContactResponse(BaseModel):
    success: bool
    message: str
    received_at: str
    inquiry_id: str

class HealthStatus(BaseModel):
    status: str
    developer: str
    role: str
    timestamp: str
    environment: str
    version: str

class InquiriesResponse(BaseModel):
    status: str
    total: int
    inquiries: List[dict]

# Security config for Admin endpoints
ADMIN_SECRET_KEY = os.getenv("ADMIN_SECRET_KEY", "shivang-admin-key")

def verify_admin_access(key: Optional[str] = None, x_admin_key: Optional[str] = None):
    """
    Validates admin access token provided via query parameter (?key=...)
    or request header (X-Admin-Key).
    """
    token = x_admin_key or key
    if not token or token.strip() != ADMIN_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized: Invalid or missing admin key. Provide ?key=... or X-Admin-Key header."
        )

# Helper to log/store messages locally
INQUIRIES_DIR = PROJECT_ROOT / "data"
INQUIRIES_FILE = INQUIRIES_DIR / "inquiries.json"

def get_all_inquiries() -> List[dict]:
    if not INQUIRIES_FILE.exists():
        return []
    try:
        with open(INQUIRIES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def save_inquiry(inquiry_data: dict):
    try:
        INQUIRIES_DIR.mkdir(parents=True, exist_ok=True)
        inquiries = []
        if INQUIRIES_FILE.exists():
            with open(INQUIRIES_FILE, "r", encoding="utf-8") as f:
                inquiries = json.load(f)
        inquiries.append(inquiry_data)
        with open(INQUIRIES_FILE, "w", encoding="utf-8") as f:
            json.dump(inquiries, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"[Contact Inquiry Received]: {inquiry_data} (Notice: {e})")

def send_telegram_notification(inquiry: dict) -> bool:
    """
    Dispatches real-time push alert to developer's Telegram account using
    the Telegram Bot API. 100% free, zero external dependencies.
    """
    bot_token = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
    chat_id = os.getenv("TELEGRAM_CHAT_ID", "").strip()

    if not bot_token or not chat_id:
        print("[Telegram Alert]: Skipped (TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured)")
        return False

    safe_name = html.escape(str(inquiry.get("name", "Unknown")))
    safe_email = html.escape(str(inquiry.get("email", "N/A")))
    safe_message = html.escape(str(inquiry.get("message", "")))
    inquiry_id = html.escape(str(inquiry.get("id", "INQ-UNKNOWN")))
    created_at = html.escape(str(inquiry.get("created_at", "Just now")))

    message_text = (
        "🚀 <b>New Portfolio Inquiry Received!</b>\n\n"
        f"👤 <b>Name:</b> {safe_name}\n"
        f"📧 <b>Email:</b> {safe_email}\n"
        f"🆔 <b>Inquiry ID:</b> <code>{inquiry_id}</code>\n"
        f"🕒 <b>Time:</b> {created_at}\n\n"
        f"💬 <b>Message:</b>\n"
        f"<blockquote>{safe_message}</blockquote>\n\n"
        "🔗 <i>Sent from Portfolio FastAPI Engine</i>"
    )

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = json.dumps({
        "chat_id": chat_id,
        "text": message_text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True
    }).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=6) as response:
            if response.status == 200:
                print(f"[Telegram Alert]: Dispatched successfully for {inquiry_id}")
                return True
    except Exception as e:
        print(f"[Telegram Alert Error]: Failed to dispatch alert: {e}")
        return False
    return False


# Static Files Mounting for Local Server
if (PROJECT_ROOT / "css").exists():
    app.mount("/css", StaticFiles(directory=str(PROJECT_ROOT / "css")), name="css")
if (PROJECT_ROOT / "js").exists():
    app.mount("/js", StaticFiles(directory=str(PROJECT_ROOT / "js")), name="js")
if (PROJECT_ROOT / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(PROJECT_ROOT / "assets")), name="assets")

# Frontend Web Routes (Local & Direct Serving)
@app.get("/", tags=["Frontend"])
def serve_home():
    index_file = PROJECT_ROOT / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    return {
        "message": "Shivang Pandey Developer Portfolio API is operational.",
        "docs": "/docs",
        "health": "/api/health"
    }

@app.get("/resume", tags=["Frontend"])
def serve_resume():
    resume_file = PROJECT_ROOT / "resume.html"
    if resume_file.exists():
        return FileResponse(str(resume_file))
    return FileResponse(str(PROJECT_ROOT / "index.html"))

# REST API Endpoints
@app.get("/api/health", response_model=HealthStatus, tags=["System Health"])
def health_check():
    now_iso = datetime.now(timezone.utc).isoformat()
    return HealthStatus(
        status="healthy",
        developer="Shivang Pandey",
        role="Full-Stack Web Developer & Python Backend Specialist",
        timestamp=now_iso,
        environment=os.getenv("VERCEL_ENV", "local"),
        version="1.0.0"
    )

@app.get("/api/info", tags=["Developer Info"])
def developer_info():
    return {
        "name": "Shivang Pandey",
        "education": "Master of Computer Applications (MCA) - IET Lucknow",
        "primary_focus": "Python Backend Engineering (FastAPI, Django, Flask)",
        "frontend_stack": ["HTML5", "CSS3", "JavaScript (ES6+)", "React.js", "Next.js"],
        "database_stack": ["PostgreSQL", "MySQL", "SQLite", "Relational Schema Design"],
        "contact": {
            "email": "pandeyshivang987@gmail.com",
            "phone": "+91 9026399211",
            "whatsapp": "https://wa.me/919026399211",
            "github": "https://github.com/ShivangWithCode/Portfolio",
            "location": "India (IST / UTC+5:30)"
        },
        "availability": "Available for Freelance Projects, Contracts & Full-Time Roles"
    }

@app.get("/api/projects", tags=["Projects"])
def get_projects():
    return [
        {
            "id": "swiftkart",
            "title": "SwiftKart - Full-Stack Modern E-Commerce Platform",
            "architecture": "Python REST API (FastAPI / Flask) + React.js",
            "database": "SQLite / PostgreSQL",
            "features": [
                "Real-Time Catalog Search",
                "Persistent Cart Pipeline",
                "Relational Order Transactions",
                "Modular RESTful Endpoints"
            ]
        },
        {
            "id": "stockflow",
            "title": "StockFlow - Enterprise Inventory & Management Platform",
            "architecture": "Python / Django ORM + JavaScript",
            "database": "PostgreSQL",
            "features": [
                "Multi-Warehouse Inventory Tracking",
                "Automated Supplier Replenishment",
                "Role-Based Access Control",
                "Interactive Metrics Analytics"
            ]
        },
        {
            "id": "ministore",
            "title": "MiniStore - Modular E-Commerce & Order Engine",
            "architecture": "Python / Flask Blueprints + Jinja2/JS",
            "database": "SQLite / MySQL",
            "features": [
                "Flask Blueprints MVC Architecture",
                "Relational Schema Migrations",
                "Session-Based Cart State",
                "Automated Invoice Calculations"
            ]
        }
    ]

@app.post("/api/contact", response_model=ContactResponse, status_code=status.HTTP_201_CREATED, tags=["Contact Inquiries"])
def submit_contact_form(contact: ContactMessage, background_tasks: BackgroundTasks):
    timestamp_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    inquiry_id = f"INQ-{int(datetime.now(timezone.utc).timestamp())}"
    
    inquiry_record = {
        "id": inquiry_id,
        "name": contact.name.strip(),
        "email": str(contact.email).strip().lower(),
        "message": contact.message.strip(),
        "created_at": timestamp_str
    }
    
    # Save inquiry locally
    save_inquiry(inquiry_record)
    
    # Dispatch non-blocking instant Telegram push notification (if credentials provided in .env/Vercel)
    background_tasks.add_task(send_telegram_notification, inquiry_record)
    
    return ContactResponse(
        success=True,
        message=f"Thank you, {contact.name.strip()}! Your message has been received. I will get back to you shortly.",
        received_at=timestamp_str,
        inquiry_id=inquiry_id
    )

@app.get("/api/inquiries", response_model=InquiriesResponse, tags=["Admin Operations"])
def view_inquiries(
    key: Optional[str] = Query(None, description="Admin secret key query parameter (?key=...)"),
    x_admin_key: Optional[str] = Header(None, description="Admin secret key header (X-Admin-Key)")
):
    """
    Protected endpoint to inspect client/recruiter inquiries received via the contact form.
    Requires authentication via query parameter (?key=...) or header (X-Admin-Key).
    """
    verify_admin_access(key=key, x_admin_key=x_admin_key)
    inquiries = get_all_inquiries()
    return InquiriesResponse(
        status="success",
        total=len(inquiries),
        inquiries=list(reversed(inquiries))
    )

@app.delete("/api/inquiries/{inquiry_id}", tags=["Admin Operations"])
def delete_inquiry(
    inquiry_id: str,
    key: Optional[str] = Query(None, description="Admin secret key query parameter (?key=...)"),
    x_admin_key: Optional[str] = Header(None, description="Admin secret key header (X-Admin-Key)")
):
    """
    Protected endpoint to remove an inquiry or clear all inquiries using ID 'clear-all'.
    """
    verify_admin_access(key=key, x_admin_key=x_admin_key)
    inquiries = get_all_inquiries()

    if inquiry_id.lower() == "clear-all":
        INQUIRIES_DIR.mkdir(parents=True, exist_ok=True)
        with open(INQUIRIES_FILE, "w", encoding="utf-8") as f:
            json.dump([], f, indent=2)
        return {"status": "success", "message": "All inquiries cleared.", "remaining": 0}

    filtered = [inq for inq in inquiries if inq.get("id") != inquiry_id]
    if len(filtered) == len(inquiries):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Inquiry with ID '{inquiry_id}' not found."
        )

    INQUIRIES_DIR.mkdir(parents=True, exist_ok=True)
    with open(INQUIRIES_FILE, "w", encoding="utf-8") as f:
        json.dump(filtered, f, indent=2, ensure_ascii=False)

    return {
        "status": "success",
        "message": f"Inquiry '{inquiry_id}' removed successfully.",
        "remaining": len(filtered)
    }

