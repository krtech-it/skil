from pydantic import BaseModel, Field, EmailStr


class UserSchema(BaseModel):
    fullname: str
    username: str
    password: str
    admin: bool

    class Config:
        json_schema_extra = {
            "example": {
                "fullname": "Abdulazeez Abdulazeez Adeshina",
                "username": "test",
                "password": "weakpassword"
            }
        }


class UserLoginSchema(BaseModel):
    username:str
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "username": "test",
                "password": "weakpassword"
            }
        }


class UserOutput(BaseModel):
    username: str
    full_name: str
    admin: bool
