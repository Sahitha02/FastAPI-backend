from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import time
import logging

from app.api.routes import users, auth
from app.db.session import engine
from app.db.base import Base
from app.models import user  # noqa
from app.core.logging_config import setup_logging

# Setup logging
setup_logging()
logger = logging.getLogger("app")

app = FastAPI(
    title="NavRoutes API",
    version="0.1.0",
    description="Backend API for React navigation/auth demo"
)

from fastapi.exceptions import RequestValidationError
from fastapi import HTTPException
from jose import JWTError

from app.core.exception_handlers import (
    http_exception_handler,
    validation_exception_handler,
    jwt_exception_handler,
    general_exception_handler
)

# Register handlers
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(JWTError, jwt_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# CORS settings
origins = [
    # "http://localhost:5173",
    # "http://localhost:5174",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()

    response = await call_next(request)

    process_time = (time.time() - start_time) * 1000
    logger.info(
        "%s %s - %s (%.2fms)",
        request.method,
        request.url.path,
        response.status_code,
        process_time,
    )

    return response


@app.get("/")
def read_root():
    return {"message": "FastAPI backend is running"}


# ------------------------------------------
# ✅ CUSTOM OPENAPI SCHEMA (Fix Swagger Auth)
# ------------------------------------------
from fastapi.openapi.utils import get_openapi

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

    # Add BearerAuth security scheme
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }

    # Apply BearerAuth globally to all routes
    for path in openapi_schema["paths"].values():
        for method in path.values():
            method.setdefault("security", [{"BearerAuth": []}])

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi


# Routers
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])
