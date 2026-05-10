import autogen
from ..database.db_manager import save_conversation

class AdmissionsChatAgent:
    def __init__(self, db, llm_config):
        self.db = db
        self.llm_config = llm_config
        self.agent = autogen.AssistantAgent(
            name="AdmissionsConcierge",
            llm_config=llm_config,
            system_message="""You are the XAMK University Admissions Concierge.
            You help international students with questions about:
            1. Tuition fees (€9,700 - €12,000 per year).
            2. Scholarships (up to 50% discount).
            3. Housing (Mikkeli, Kouvola, Savonlinna, Kotka).
            4. Entrance exams (UAS exam).
            5. Living in Finland (nature, safety, high tech).
            Be helpful, use emojis, and encourage them to apply.
            If they seem interested, ask for their email to send them a guide."""
        )

    def get_response(self, message: str, chat_history: list | None = None):
        if chat_history is None:
            chat_history = []
        user_proxy = autogen.UserProxyAgent(
            name="UserProxy",
            human_input_mode="NEVER",
            max_consecutive_auto_reply=1,
            code_execution_config=False,
        )
        
        chat_result = user_proxy.initiate_chat(
            self.agent,
            message=message,
            clear_history=False # We want to maintain context if we pass it
        )
        
        response = chat_result.chat_history[-1]["content"]
        
        # Save to DB
        save_conversation(self.db, messages=chat_result.chat_history)
        
        return response
