import json
from typing import Dict, Any

from api.config import Config


class PayloadValidator:
    def __init__(self, config: Config):
        self.config = config

    def validate_and_clean(self, llm_response: str) -> Dict[str, Any]:
        # Clean response
        cleaned = llm_response.strip()

        # Parse JSON
        try:
            payload = json.loads(cleaned)
        except json.JSONDecodeError:
            # Try to extract JSON from response
            start_idx = cleaned.find("{")
            end_idx = cleaned.rfind("}")
            if start_idx != -1 and end_idx != -1:
                json_str = cleaned[start_idx : end_idx + 1]
                payload = json.loads(json_str)
            else:
                raise ValueError("Could not find valid JSON in response")

        # Add missing required fields
        for field in self.config.required_fields:
            if field not in payload:
                if field == "order_lines":
                    payload[field] = []
                elif field == "total_cost":
                    payload[field] = 0.0
                else:
                    payload[field] = ""

        # Ensure order_lines is valid
        if not isinstance(payload["order_lines"], list):
            payload["order_lines"] = []

        # Validate each order line
        for order_line in payload["order_lines"]:
            required_fields = [
                "description",
                "unit_price",
                "amount",
                "unit",
                "total_price",
                "department",
                "vat_id",
            ]
            for field in required_fields:
                if field not in order_line:
                    if field in ["unit_price", "total_price"]:
                        order_line[field] = 0.0
                    elif field == "amount":
                        order_line[field] = 0
                    else:
                        order_line[field] = ""

        # Recalculate total cost from order lines to ensure accuracy
        if payload["order_lines"]:
            calculated_total = sum(
                line.get("total_price", 0.0) for line in payload["order_lines"]
            )
            payload["total_cost"] = calculated_total

        return payload
