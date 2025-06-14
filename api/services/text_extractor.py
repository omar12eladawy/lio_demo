import io
import pdfplumber
from typing import Dict, Callable


class TextExtractor:
    def __init__(self):
        self.extractors: Dict[str, Callable] = {
            "application/pdf": self._extract_from_pdf,
            "text/plain": self._extract_from_text,
            "application/octet-stream": self._extract_from_text,
        }

    def extract(self, content: bytes, content_type: str) -> str:
        extractor = self.extractors.get(content_type)
        if not extractor:
            raise ValueError(f"Unsupported content type: {content_type}")

        return extractor(content)

    def _extract_from_pdf(self, content: bytes) -> str:
        pdf_file = io.BytesIO(content)
        extracted_text = ""

        with pdfplumber.open(pdf_file) as pdf:
            for page_num, page in enumerate(pdf.pages):
                page_text = page.extract_text()
                if page_text:
                    extracted_text += f"\n--- Page {page_num + 1} ---\n{page_text}"

        return extracted_text.strip()

    def _extract_from_text(self, content: bytes) -> str:
        try:
            return content.decode("utf-8")
        except UnicodeDecodeError:
            return content.decode("latin-1")
