from gigachat import GigaChat
from gigachat.models import Chat, Messages, MessagesRole
import os
import json

GIGACHAT_TOKEN = os.getenv('GIGACHAT_TOKEN')

def analyze_best_practices(code_snippets: list[str], language: str, pep8_score: float) -> dict:
    """Анализ Best Coding Practices"""
    try:
        style_guide = {
            'python': 'PEP8, PEP257',
            'javascript': 'ESLint, Airbnb style',
            'java': 'Google Java Style, Oracle conventions',
            'cpp': 'Google C++ Style Guide',
            'go': 'Effective Go',
            'rust': 'Rust API Guidelines'
        }.get(language, 'industry standards')
        
        messages = [
            Messages(
                role=MessagesRole.SYSTEM,
                content=f"""Ты эксперт Best Coding Practices для {language}.
                    
Стандарты: {style_guide}
                    
Оцени: читаемость, naming conventions, структура, паттерны.
                    
Верни ТОЛЬКО JSON: {{"score": 8, "details": "объяснение"}}
                """
            ),
            Messages(
                role=MessagesRole.USER,
                content=f"""Проект на {language}. PEP8 score: {pep8_score}.
                
Код:
{chr(10).join([f"File {i}: {s[:800]}..." for i, s in enumerate(code_snippets[:3])])}
                """
            )
        ]
        
        with GigaChat(credentials=GIGACHAT_TOKEN) as giga:
            chat = Chat(messages=messages)
            response = giga.chat(chat)
            
            content = response.choices[0].message.content
            start = content.find('{')
            end = content.rfind('}') + 1
            result = json.loads(content[start:end])
            return result
            
    except Exception as e:
        return {'score': 5.0, 'details': f'Ошибка: {str(e)}'}
