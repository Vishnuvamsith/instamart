from langchain.chains import LLMChain
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough
from langchain_google_genai import ChatGoogleGenerativeAI
from config import Config

class LLMChainFactory:
    def __init__(self):
        self.config = Config()
    
    def create_llm(self):
        return ChatGoogleGenerativeAI(
            model=self.config.GEMINI_MODEL,
            temperature=0.5,
            top_p=0.85,
            top_k=30,
            max_output_tokens=500
        )
    
    def create_llm_chain(self, memory=None):
        system_prompt = """You are Instamart's FLE HR assistant. Follow these rules:
1. Use provided context to answer questions
2. If unsure, say "I don't know"
3. Keep answers concise (1-2 sentences)
4. Maintain professional, helpful tone
5. Consider full conversation history
6. For HR policies, always check exact dates/numbers
7. And try to answer as humanly as possible and also please understand the question properly and then answer accordingly"""

        llm = self.create_llm()
        
        if memory:
            prompt = ChatPromptTemplate.from_messages([
                ("system", system_prompt),
                MessagesPlaceholder(variable_name="chat_history"),
                ("human", "Question: {question}\nContext: {context}")
            ])
            
            chain = (
                {
                    "question": RunnablePassthrough(),
                    "context": lambda x: "\n\n".join([doc.page_content for doc in x["docs"]]),
                    "chat_history": lambda x: x["chat_history"]
                }
                | prompt
                | llm
            )
            
            return chain
        else:
            prompt = PromptTemplate(
                template=f"""{system_prompt}
Context: {{context}}
Question: {{question}}""",
                input_variables=["question", "context"]
            )
            
            return LLMChain(
                llm=llm,
                prompt=prompt
            )

llm_chain_factory = LLMChainFactory()