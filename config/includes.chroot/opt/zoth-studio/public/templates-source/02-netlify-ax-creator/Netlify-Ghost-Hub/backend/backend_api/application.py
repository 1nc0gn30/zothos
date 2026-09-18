from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .routers.email import router as email_router
from .routers.ghost import router as ghost_router
from .routers.sites import router as sites_router
from .routers.tools import router as tools_router
from .state import BASE_CLONE_DIR, DOWNLOADS_DIR


def create_app() -> FastAPI:
    app = FastAPI()
    app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

    # Mount downloads so frontend can stream generated media previews
    app.mount("/downloads", StaticFiles(directory=DOWNLOADS_DIR), name="downloads")
    app.mount("/repos", StaticFiles(directory=BASE_CLONE_DIR), name="repos")

    app.include_router(sites_router)
    app.include_router(ghost_router)
    app.include_router(email_router)
    app.include_router(tools_router)
    return app
