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
