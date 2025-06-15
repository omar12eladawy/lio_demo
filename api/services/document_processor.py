import json
import os
from typing import Dict, Any
from langfuse.decorators import observe, langfuse_context
from langfuse import Langfuse
from api.config import Config
from api.services.llm_processor import LLMProcessor
from api.services.payload_validator import PayloadValidator
from api.services.text_extractor import TextExtractor
import dotenv

dotenv.load_dotenv(".env.local")

lf = Langfuse(
    secret_key=os.getenv("LANGFUSE_SECRET_KEY"),
    public_key=os.getenv("LANGFUSE_PUBLIC_KEY"),
    host="https://cloud.langfuse.com",
)


class DocumentProcessor:
    def __init__(self, config: Config):
        self.config = config
        self.text_extractor = TextExtractor()
        self.llm_processor = LLMProcessor(self.config)
        self.validator = PayloadValidator(self.config)

    @observe(name="document_processing")
    async def process_document(
        self, content: bytes, content_type: str
    ) -> Dict[str, Any]:
        # Step 1: Extract text
        document_text = self.text_extractor.extract(content, content_type)

        langfuse_context.update_current_trace(
            tags=["annotation_queue", "document_processing"]
        )
        if not document_text or len(document_text.strip()) < 10:
            raise ValueError("No meaningful text could be extracted")

        # Step 2: Process with LLM
        llm_response = self.llm_processor.process(document_text)
        print(f"LLM response: {llm_response}")
        # Step 3: Validate and structure
        payload = self.validator.validate_and_clean(llm_response)
        print(f"Payload: {payload.get('total_cost')}")
        print(f"LLM response: {json.loads(llm_response.strip()).get('total_cost')}")

        if payload.get("total_cost", 0) != json.loads(llm_response.strip()).get(
            "total_cost", 0
        ):
            langfuse_context.score_current_trace(
                name="total_cost_mismatch",
                value=1,
                comment="Total cost mismatch between extracted lines and actualtotal",
            )
        else:
            langfuse_context.score_current_trace(
                name="total_cost_mismatch",
                value=0,
                comment="""Total cost matches between extracted lines and actual total.
                Could be false positive if dict[total_cost] is not in the document.""",
            )

        return payload
