from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class OrderLine(BaseModel):
    description: str
    unit_price: float
    amount: float
    unit: str
    total_price: float


class ProcurementRequest(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    requestor_name: str
    title: str
    vendor_name: str
    vat_id: str
    commodity_group: str
    order_lines: List[OrderLine]
    total_cost: float
    department: str
    status: str = "OPEN"  # OPEN, IN_PROGRESS, CLOSED
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "requestor_name": "John Doe",
                "title": "Adobe Creative Cloud Subscription",
                "vendor_name": "Adobe Systems",
                "vat_id": "DE123456789",
                "commodity_group": "Software Licenses",
                "order_lines": [
                    {
                        "description": "Adobe Photoshop License",
                        "unit_price": 200.0,
                        "amount": 5,
                        "unit": "licenses",
                        "total_price": 1000.0,
                    }
                ],
                "total_cost": 1000.0,
                "department": "HR",
                "status": "OPEN",
            }
        }
