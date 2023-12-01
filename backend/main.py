from typing import List
import fastapi as _fastapi
import fastapi.security as _security
import sqlalchemy as _sql
import sqlalchemy.orm as _orm

import services as _services, schemas as _schemas
from database import Base, engine

app = _fastapi.FastAPI()


def create_tables():
    Base.metadata.create_all(bind=engine)

@app.on_event("startup")
async def startup():
    create_tables()


@app.post("/api/users")
async def create_user(
        user: _schemas.UserCreate, db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    db_user = await _services.get_user_by_email(user.email, db)
    if db_user:
        raise _fastapi.HTTPException(status_code=400, detail="Email already in use")

    return await _services.create_user(user, db)


@app.post("/api/token")
async def genereate_token(form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(),db: _orm.Session = _fastapi.Depends(_services.get_db)):
    user = await _services.authencticate_user(form_data.username, form_data.password, db)

    if not user:
        raise _fastapi.HTTPException(status_code=401, detail="Invaild Credential")
    
    return await _services.create_token(user)


@app.get("/api/users/me", response_model=_schemas.User)
async def get_user(user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return user