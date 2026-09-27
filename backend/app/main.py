from pathlib import Path

from fastapi import (
    FastAPI,
    HTTPException,
)

from fastapi.middleware.cors import (
    CORSMiddleware,
)

from fastapi.responses import FileResponse

from sqlalchemy import text

from app.api.router import api_router
from app.core.config import settings
from app.db.session import SessionLocal

app = FastAPI(
    title="Villa Imperial API",
    description=("Sistema de administración " "de Villa Imperial"),
    version="1.0.0",
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# API
# ==========================================

app.include_router(api_router)


# ==========================================
# HEALTH
# ==========================================


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/health/db")
def health_database():
    with SessionLocal() as db:
        db.execute(text("SELECT 1"))

    return {
        "status": "ok",
        "database": "connected",
    }


# ==========================================
# FRONTEND REACT
# ==========================================

FRONTEND_DIR = Path(__file__).resolve().parents[1] / "web"


@app.get(
    "/{full_path:path}",
    include_in_schema=False,
)
async def serve_frontend(
    full_path: str,
):
    # No convertir errores API
    # en páginas React.

    if full_path.startswith("api/"):
        raise HTTPException(
            status_code=404,
            detail="Not found",
        )

    frontend_root = FRONTEND_DIR.resolve()

    requested_file = (frontend_root / full_path).resolve()

    # Archivos reales:
    # /assets/...
    # /villa/logo.png
    # /villa/1.jpg
    # etc.

    if requested_file.is_file() and frontend_root in requested_file.parents:
        return FileResponse(requested_file)

    # React Router:
    #
    # /admin
    # /admin/clientes
    # /admin/reportes
    # ...
    #
    # siempre regresan index.html.

    index_file = frontend_root / "index.html"

    if not index_file.exists():
        raise HTTPException(
            status_code=404,
            detail=("Frontend no encontrado."),
        )

    return FileResponse(index_file)
