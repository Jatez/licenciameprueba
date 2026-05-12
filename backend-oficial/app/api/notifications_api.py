from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user
from app.models.auth import User
from datetime import datetime, timedelta

router = APIRouter(prefix="/notifications", tags=["notifications"])

DEMO_NOTIFICATIONS = [
    {
        "id": "notif-001",
        "type": "license_issued",
        "title": "Licencia emitida",
        "message": "Tu licencia para 'Noche en Bogotá' ha sido emitida correctamente.",
        "read": False,
        "created_at": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
    },
    {
        "id": "notif-002",
        "type": "purchase_confirmed",
        "title": "Compra de créditos confirmada",
        "message": "Se acreditaron 600 créditos a tu wallet.",
        "read": True,
        "created_at": (datetime.utcnow() - timedelta(days=3)).isoformat(),
    },
    {
        "id": "notif-003",
        "type": "low_balance",
        "title": "Saldo bajo",
        "message": "Te quedan menos de 50 créditos disponibles.",
        "read": False,
        "created_at": (datetime.utcnow() - timedelta(days=5)).isoformat(),
    },
]

@router.get("/")
async def list_notifications(current_user: User = Depends(get_current_user)):
    return DEMO_NOTIFICATIONS

@router.patch("/{notification_id}/read")
async def mark_read(notification_id: str, current_user: User = Depends(get_current_user)):
    return {"success": True, "notification_id": notification_id, "read": True}

@router.patch("/read-all")
async def mark_all_read(current_user: User = Depends(get_current_user)):
    return {"success": True, "marked": len(DEMO_NOTIFICATIONS)}
