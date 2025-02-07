from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import arenas, analytics
from .middleware.error_handler import error_handler

app = FastAPI(title="Basketball Arena Finder")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add error handling middleware
app.middleware("http")(error_handler)

# Include routers
app.include_router(arenas.router, prefix="/api/arenas", tags=["arenas"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])

@app.get("/")
async def root():
    return {"message": "Basketball Arena Finder API"} 