# from langchain.chains import LLMChain
# from langchain_core.prompts import PromptTemplate, ChatPromptTemplate, MessagesPlaceholder
# from langchain_core.runnables import RunnablePassthrough
# from langchain_google_genai import ChatGoogleGenerativeAI
# from config import Config

# class LLMChainFactory:
#     def __init__(self):
#         self.config = Config()
    
#     def create_llm(self):
#         return ChatGoogleGenerativeAI(
#             model=self.config.GEMINI_MODEL,
#             temperature=0.5,
#             top_p=0.85,
#             top_k=30,
#             max_output_tokens=500
#         )
    
#     def create_llm_chain(self, memory=None):
#         system_prompt = """You are Instamart's FLE HR assistant. Your job is to help employees with HR-related questions and also engage respectfully in normal human conversation. Follow these rules:

# 1. Use provided context to answer HR questions factually and clearly.
# 2. If the question is not answerable with available context, respond exactly with:
#    "Your query has been forwarded to the concerned HR. Please wait for their reply."
# 3. For non-question inputs like "thank you", "no", or greetings, respond politely and appropriately.
# 4. Keep answers short — 1-2 sentences max.
# 5. Always maintain a helpful, warm, professional tone.
# 6. Use full conversation history to maintain continuity.
# 7. For HR data (dates, numbers, policies), be as accurate and cautious as possible.
# 8. Try to sound human and understand the user’s intent before answering.
# """

#         llm = self.create_llm()
        
#         # if memory:
#         #     prompt = ChatPromptTemplate.from_messages([
#         #         ("system", system_prompt),
#         #         MessagesPlaceholder(variable_name="chat_history"),
#         #         ("human", "Question: {question}\nContext: {context}")
#         #     ])
            
#         #     chain = (
#         #         {
#         #             "question": RunnablePassthrough(),
#         #             "context": lambda x: "\n\n".join([doc.page_content for doc in x["docs"]]),
#         #             "chat_history": lambda x: x["chat_history"]
#         #         }
#         #         | prompt
#         #         | llm
#         #     )
            
#         #     return chain
#         if memory:
#             prompt = ChatPromptTemplate.from_messages([
#                 ("system", system_prompt),
#                 MessagesPlaceholder(variable_name="chat_history"),
#                 ("human", "Question: {question}\nContext: {context}")
#             ])

#             chain = (
#                 {
#                 "question": RunnablePassthrough(),
#                 "context": lambda x: "\n\n".join([doc["text"] for doc in x["docs"]]),
#                 "chat_history": lambda x: x["chat_history"]
#                 }
#         | prompt
#         | llm
#         )

#             return chain
#         else:
#             prompt = PromptTemplate(
#                 template=f"""{system_prompt}
# Context: {{context}}
# Question: {{question}}""",
#                 input_variables=["question", "context"]
#             )
            
#             return LLMChain(
#                 llm=llm,
#                 prompt=prompt
#             )

# llm_chain_factory = LLMChainFactory()


from langchain.chains import LLMChain
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough
from langchain_community.chat_models import ChatOpenAI
from config import Config

class LLMChainFactory:
    def __init__(self):
        self.config = Config()
    
    def create_llm(self):
        return ChatOpenAI(
            openai_api_key=self.config.CLAUDE_KEY,
            openai_api_base=self.config.LITELLM_ENDPOINT,
            model=self.config.ANTHROPIC_MODEL_NAME,
            temperature=0.5,
            max_tokens=500,
            # Removed Gemini-specific parameters (top_p, top_k) as Claude uses different parameters
        )
    
    def create_llm_chain(self, memory=None,user_context=None):
        base_prompt = """You are Instamart's FLE HR assistant. Your job is to help employees with HR-related questions and also engage respectfully in normal human conversation. Follow these rules:

1. Use provided context to answer HR questions factually and clearly.
2. If the question is not answerable with available context, respond exactly with:
   "Your query has been forwarded to the concerned HR. Please wait for their reply."
3. For non-question inputs like "thank you", "no", or greetings, respond politely and appropriately.
4. Keep answers short — 1-2 sentences max.
5. Always maintain a helpful, warm, professional tone.
6. Use full conversation history to maintain continuity.
7. For HR data (dates, numbers, policies), be as accurate and cautious as possible.
8. Try to sound human and understand the user's intent before answering.
"""
        if user_context:
            base_prompt += f"\n\nEmployee Information:\n{user_context}"

        llm = self.create_llm()
        
        if memory:
            prompt = ChatPromptTemplate.from_messages([
                ("system", base_prompt),
                MessagesPlaceholder(variable_name="chat_history"),
                ("human", "Question: {question}\nContext: {context}")
            ])

            chain = (
                {
                    "question": RunnablePassthrough(),
                    "context": lambda x: "\n\n".join([doc["text"] for doc in x["docs"]]),
                    "chat_history": lambda x: x["chat_history"]
                }
                | prompt
                | llm
            )

            return chain
        else:
            prompt = PromptTemplate(
                template=f"""{base_prompt}
Context: {{context}}
Question: {{question}}""",
                input_variables=["question", "context"]
            )
            
            return LLMChain(
                llm=llm,
                prompt=prompt
            )

llm_chain_factory = LLMChainFactory()