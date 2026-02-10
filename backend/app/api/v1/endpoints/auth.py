"""Authentication endpoints"""

from fastapi import APIRouter, HTTPException, status
from app.models.schemas import UserCreate, UserLogin, Token, UserResponse
from app.services.user_service import user_service

router = APIRouter()


@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """
    Register a new user
    
    - **email**: Valid email address
    - **password**: Minimum 8 characters
    - **name**: User's display name
    - **interests**: List of user interests (optional)
    - **level**: Knowledge level (beginner, intermediate, advanced)
    """
    try:
        user = await user_service.create_user(user_data)
        
        return {
            "message": "User registered successfully",
            "user": user
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to register user"
        )


@router.post("/login", response_model=dict)
async def login(credentials: UserLogin):
    """
    Authenticate user and return access token
    
    - **email**: User's email
    - **password**: User's password
    
    Returns user data and JWT access token
    """
    try:
        user_data = await user_service.authenticate_user(
            credentials.email,
            credentials.password
        )
        
        return {
            "message": "Login successful",
            "user": {
                "id": user_data["id"],
                "email": user_data["email"],
                "name": user_data["name"],
                "interests": user_data["interests"],
                "level": user_data["level"]
            },
            "access_token": user_data["token"],
            "token_type": "bearer"
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to authenticate user"
        )


@router.post("/verify", response_model=dict)
async def verify_token(token: str):
    """
    Verify if a token is valid
    
    - **token**: JWT access token
    
    Returns token validity status
    """
    from app.core.security import verify_token as verify_jwt_token
    
    payload = verify_jwt_token(token)
    
    if payload:
        return {
            "valid": True,
            "user_id": payload.get("sub"),
            "email": payload.get("email")
        }
    else:
        return {"valid": False}
