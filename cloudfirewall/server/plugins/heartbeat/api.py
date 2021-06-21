from fastapi import APIRouter

router = APIRouter()


@router.get(
    "/ping",
    tags=["Ping Status API"],
    summary="Returns up status if the server is running"
)
async def get_healths():
    return {
        "name": "cloudfirewall",
        "status": "up"
    }
