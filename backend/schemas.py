import datetime as _dt

import pydantic as _pydantic


class _UserBase(_pydantic.BaseModel):
    email: str


class UserCreate(_UserBase):
    hashed_password: str

    class Config:
        orm_mode = True
        from_attributes=True


class User(_UserBase):
    id: int

    class Config:
        orm_mode = True
        from_attributes=True


class _LeadBase(_pydantic.BaseModel):
    first_name: str
    last_name: str
    email: str
    company: str
    note: str


class LeadCreate(_LeadBase):
    pass


class Lead(_LeadBase):
    id: int
    owner_id: int
    data_created: _dt.datetime
    data_last_updated: _dt.datetime

    class Config:
        orm_mode = True
        from_attributes=True


