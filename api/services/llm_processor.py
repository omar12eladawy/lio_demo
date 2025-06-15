from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langfuse import observe, get_client

from api.config import Config

lf = get_client()


class LLMProcessor:
    def __init__(self, config: Config):
        self.config = config
        self.llm = ChatOpenAI(
            model=config.model_name,
            temperature=config.temperature,
            api_key=config.openai_api_key,
        )
        self.prompt = PromptTemplate(
            input_variables=["document_text"], template=self.config.prompt_template
        )
        lf.create_prompt(
            name="document_prompt",
            prompt=self.config.prompt_template,
            config={
                "model": config.model_name,
                "temperature": config.temperature,
            },
        )

    @observe(name="llm_processing")
    def process(self, text: str) -> str:
        # Truncate if too long
        if len(text) > self.config.max_text_length:
            text = text[: self.config.max_text_length] + "... [truncated]"

        response = self.llm.invoke(self.prompt.format(document_text=text))
        return response.content
