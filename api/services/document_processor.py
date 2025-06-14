from typing import Dict, Any

from api.config import Config
from api.services.llm_processor import LLMProcessor
from api.services.payload_validator import PayloadValidator
from api.services.text_extractor import TextExtractor


class DocumentProcessor:
    def __init__(self, config: Config):
        self.config = config
        self.text_extractor = TextExtractor()
        self.llm_processor = LLMProcessor(self.config)
        self.validator = PayloadValidator(self.config)

    async def process_document(
        self, content: bytes, content_type: str
    ) -> Dict[str, Any]:
        # Step 1: Extract text
        document_text = self.text_extractor.extract(content, content_type)

        if not document_text or len(document_text.strip()) < 10:
            raise ValueError("No meaningful text could be extracted")

        # Step 2: Process with LLM
        llm_response = self.llm_processor.process(document_text)

        # Step 3: Validate and structure
        payload = self.validator.validate_and_clean(llm_response)

        return payload
