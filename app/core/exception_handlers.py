from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from jose import JWTError
import logging

logger = logging.getLogger("app")


# Handle FastAPI HTTP errors
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.error(f"HTTPException: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


# Handle validation errors (pydantic / request body issues)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )


# Handle JWT decoding errors
async def jwt_exception_handler(request: Request, exc: JWTError):
    logger.error("JWT decoding failed")
    return JSONResponse(
        status_code=401,
        content={"detail": "Invalid authentication token"},
    )


# Handle unexpected server errors
async def general_exception_handler(request: Request, exc: Exception):
    logger.exception("Internal server error")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )

