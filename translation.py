# from googletrans import Translator
# import asyncio
# import logging

# logger = logging.getLogger(__name__)

# class TranslationService:
#     def __init__(self):
#         self.translator = Translator()
    
#     async def detect_and_translate(self, text):
#         try:
#             detection = await self.translator.detect(text)
#             detected_lang = detection.lang
#             if detected_lang != 'en':
#                 translation = await self.translator.translate(text, src=detected_lang, dest='en')
#                 return translation.text, detected_lang
#             return text, detected_lang
#         except Exception as e:
#             logger.error(f"Translation error: {str(e)}")
#             return text, 'en'
    
#     async def translate_back(self, text, dest_lang):
#         if dest_lang == 'en':
#             return text
#         try:
#             translation = await self.translator.translate(text, src='en', dest=dest_lang)
#             return translation.text
#         except Exception as e:
#             logger.error(f"Reverse translation error: {str(e)}")
#             return text

# translation_service = TranslationService()
from googletrans import Translator
import asyncio
import logging

logger = logging.getLogger(__name__)

class TranslationService:
    def __init__(self):
        self.translator = Translator()
        self.loop = asyncio.new_event_loop()

    def detect_and_translate(self, text):
        try:
            # Run the async operation in a dedicated event loop
            detection = self.loop.run_until_complete(self.translator.detect(text))
            detected_lang = detection.lang
            
            if detected_lang != 'en':
                translation = self.loop.run_until_complete(
                    self.translator.translate(text, src=detected_lang, dest='en')
                )
                return translation.text, detected_lang
            return text, detected_lang
        except Exception as e:
            logger.error(f"Translation error: {str(e)}")
            return text, 'en'

    def translate_back(self, text, dest_lang):
        if dest_lang == 'en':
            return text
        try:
            translation = self.loop.run_until_complete(
                self.translator.translate(text, src='en', dest=dest_lang)
            )
            return translation.text
        except Exception as e:
            logger.error(f"Reverse translation error: {str(e)}")
            return text

translation_service = TranslationService()