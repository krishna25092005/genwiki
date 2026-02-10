"""User management endpoints"""

from fastapi import APIRouter, HTTPException, status, Depends
from app.models.schemas import UserResponse, UserUpdate
from app.services.user_service import user_service
from app.core.security import get_current_user

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    """
    Get current authenticated user's profile
    
    Requires authentication token
    """
    try:
        user = await user_service.get_user_by_id(current_user["user_id"])
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve user profile"
        )


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(user_id: str):
    """
    Get user profile by ID
    
    - **user_id**: User's ID
    """
    try:
        user = await user_service.get_user_by_id(user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve user"
        )


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_data: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update current user's profile
    
    Requires authentication token
    
    - **name**: New display name (optional)
    - **interests**: Updated interests list (optional)
    - **level**: Updated knowledge level (optional)
    - **bio**: User bio (optional)
    - **avatar**: Avatar URL (optional)
    """
    try:
        updated_user = await user_service.update_user(
            current_user["user_id"],
            user_data
        )
        
        return updated_user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user profile"
        )


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_current_user(current_user: dict = Depends(get_current_user)):
    """
    Delete current user's account
    
    Requires authentication token
    
    This action is irreversible!
    """
    try:
        deleted = await user_service.delete_user(current_user["user_id"])
        
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete user account"
        )
