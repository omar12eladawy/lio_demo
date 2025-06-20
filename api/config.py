from dataclasses import dataclass, field
import os
from api.prompts.prompts import EXTRACT_PROMPT
from pydantic import SecretStr


@dataclass
class Config:
    # LLM Settings
    openai_api_key: SecretStr = SecretStr(os.getenv("OPENAI_API_KEY", ""))
    model_name: str = "gpt-3.5-turbo"
    temperature: float = 0
    max_text_length: int = 8000
    prompt_template: str = EXTRACT_PROMPT

    # File Processing
    max_file_size_mb: int = 50

    # Validation
    required_fields: list = field(
        default_factory=lambda: [
            "requestor_name",
            "title",
            "vendor_name",
            "vat_id",
            "commodity_group",
            "department",
            "order_lines",
            "total_cost",
        ]
    )
