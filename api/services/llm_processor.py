from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate

from api.config import Config
from api.prompts.prompts import EXTRACT_PROMPT


class LLMProcessor:
    def __init__(self, config: Config):
        self.config = config
        self.llm = ChatOpenAI(
            model=config.model_name,
            temperature=config.temperature,
            api_key=config.openai_api_key,
        )
        self.prompt = PromptTemplate(
            input_variables=["document_text"],
            template=EXTRACT_PROMPT,
        )

    def process(self, text: str) -> str:
        # Truncate if too long
        if len(text) > self.config.max_text_length:
            text = text[: self.config.max_text_length] + "... [truncated]"

        response = self.llm.invoke(self.prompt.format(document_text=text))
        return response.content
