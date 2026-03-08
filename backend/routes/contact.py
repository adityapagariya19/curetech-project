from fastapi import APIRouter
from schemas.contact import ContactCreate

router = APIRouter(
    prefix="/contact",
    tags=["Contact"]
)

@router.post("/")
def contact_us(data: ContactCreate):
    # Later: save to database / send email
    print("New Contact Message:")
    print(data)

    return {
        "success": True,
        "message": "Thanks for contacting CureTech. We will get back to you soon."
    }
