import os
import re
import json
import requests
import pandas as pd
import uuid
import urllib3
from typing import List, Dict
from langchain_huggingface import HuggingFaceEmbeddings

# установка библиотек 
# pip install pypdf python-docx pandas faiss-cpu tiktoken langchain langchain-community langchain-text-splitters langchain-huggingface
# pip install sentence-transformers
# Отключаем предупреждения SSL
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# 1. ДАННЫЕ АВТОРИЗАЦИИ GIGACHAT
CLIENT_ID = "019c9d5c-6b7d-74a4-a83a-9f6d55e6f417"
AUTH_DATA = "MDE5YzlkNWMtNmI3ZC03NGE0LWE4M2EtOWY2ZDU1ZTZmNDE3OmU4NmJlZTQzLWY5ZjktNDllMi05ZWJlLWIwNTQ2ODdhOGRhZA=="

# 2. ФУНКЦИЯ ПОЛУЧЕНИЯ ТОКЕНА
def get_access_token() -> str:
    url = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth"
    payload = {'scope': 'GIGACHAT_API_PERS'}
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'RqUID': str(uuid.uuid4()),
        'Authorization': f'Basic {AUTH_DATA}'
    }
    try:
        response = requests.post(url, headers=headers, data=payload, verify=False)
        response.raise_for_status()
        return response.json()['access_token']
    except Exception as e:
        print(f"Ошибка авторизации: {e}")
        return None

# 3. БЛОК RAG
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter

VECTOR_DB_PATH = "vector_db_instructions"
INSTRUCTIONS_DIR = "instructions"

def get_gigachat_embeddings(texts, access_token):
    url = "https://gigachat.devices.sberbank.ru/v1/embeddings"
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    # Модель для эмбеддингов — 'GigaChat'
    data = {
        "model": "GigaChat",
        "input": [{"text": t} for t in texts]
    }
    try:
        # Добавляем verify=False
        response = requests.post(url, headers=headers, json=data, verify=False, timeout=40)
        response.raise_for_status()
        return [item["embedding"] for item in response.json().get('data', [])]
    except Exception as e:
        print(f"Ошибка при получении эмбеддингов: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Детали 403: {e.response.text}")
        return None

def build_vector_db():
    #print("Индексирую инструкции")
    documents = []
    if not os.path.exists(INSTRUCTIONS_DIR): os.makedirs(INSTRUCTIONS_DIR)

    for filename in os.listdir(INSTRUCTIONS_DIR):
        if filename.endswith(".pdf"):
            loader = PyPDFLoader(os.path.join(INSTRUCTIONS_DIR, filename))
            documents.extend(loader.load())

    if not documents:
        print("PDF файлы не найдены в папке instructions/")
        return None

    texts = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200).split_documents(documents)
    token = get_access_token()
    if not token: return None

    text_strings = [doc.page_content for doc in texts]
    embeddings_list = get_gigachat_embeddings(text_strings, token)

    if embeddings_list:
        text_embeddings = list(zip(text_strings, embeddings_list))
        vector_db = FAISS.from_embeddings(text_embeddings, embedding_function=None, metadatas=[d.metadata for d in texts])
        vector_db.save_local(VECTOR_DB_PATH)
        return vector_db
    return None

# Используем актуальную модель 'paraphrase-multilingual-MiniLM-L12-v2'
def get_local_embeddings():
    #print("Загрузка локальной модели эмбеддингов (HuggingFace)")
    model_name = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    return HuggingFaceEmbeddings(model_name=model_name)

def build_vector_db():
    #print("Индексирую инструкции локально")
    documents = []
    if not os.path.exists(INSTRUCTIONS_DIR): os.makedirs(INSTRUCTIONS_DIR)

    for filename in os.listdir(INSTRUCTIONS_DIR):
        if filename.endswith(".pdf"):
            loader = PyPDFLoader(os.path.join(INSTRUCTIONS_DIR, filename))
            documents.extend(loader.load())

    if not documents:
        print("PDF файлы не найдены в папке instructions/")
        return None

    texts = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200).split_documents(documents)
    embeddings = get_local_embeddings()

    vector_db = FAISS.from_documents(texts, embeddings)
    vector_db.save_local(VECTOR_DB_PATH)
    print("База данных успешно создана локально!")
    return vector_db

# Ввод запроса ассистенту
user_input = input("Запрос ассистенту: ")

# 4. БЛОК ГЕНЕРАЦИИ
def send_to_gigachat(prompt_user: str, access_token: str) -> str:
    # Используем полный путь к API
    url = "https://gigachat.devices.sberbank.ru/api/v1/chat/completions"
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'RqUID': str(uuid.uuid4())
    }
    PROMPT_SYS = (
        "Ты — ассистент по технической документации. "
        "Твой ответ должен быть основан *только* на предоставленном фрагменте текста. "
        "Не добавляй информацию из своих знаний. Отвечай кратко и по делу."
    )
    data = {
        "model": "GigaChat",
        "messages": [
            {"role": "system", "content": PROMPT_SYS},
            {"role": "user", "content": prompt_user}
        ],
        "temperature": 0.1
    }
    try:
        response = requests.post(url, headers=headers, json=data, verify=False, timeout=40)
        if response.status_code != 200:
            return f"Ошибка {response.status_code}: {response.text}"
        return response.json()['choices'][0]['message']['content'].strip()
    except Exception as e:
        return f"Ошибка связи с GigaChat: {e}"

# Логика для определения, является ли запрос учебной задачей
def is_task_query(query: str) -> bool:
    # Преобразуем запрос в нижний регистр для регистронезависимого поиска
    lower_query = query.lower()
    
    # Список ключевых слов, указывающих на учебную задачу
    task_keywords = [
        "задание", "урок", "учебная", "реши", "сделай за меня",
        "учебное задание", "помоги с задачей", "ответ на вопрос",
        "лабораторная работа", "курсовая работа", "дипломная работа"
    ]
    
    # Проверяем наличие ключевых слов в запросе
    for keyword in task_keywords:
        if keyword in lower_query:
            return True
    
    return False

# 5. ГЛАВНЫЙ ЦИКЛ С ПРОВЕРКОЙ ФАЙЛОВ
if __name__ == "__main__":
    #print("Запуск ассистента")
    token = get_access_token()

    if not token:
        print("Ошибка: Не удалось получить токен.")
    else:
        embeddings_model = get_local_embeddings()

        # Проверяем наличие базы или создаем ее
        if not os.path.exists(VECTOR_DB_PATH):
            # Проверяем наличие PDF перед созданием
            pdf_files = [f for f in os.listdir(INSTRUCTIONS_DIR) if f.endswith('.pdf')] if os.path.exists(INSTRUCTIONS_DIR) else []
            if not pdf_files:
                print(f"Внимание: Папка {INSTRUCTIONS_DIR} пуста. Загрузите PDF файлы.")
                vector_db = None
            else:
                vector_db = build_vector_db()
        else:
            vector_db = FAISS.load_local(VECTOR_DB_PATH, embeddings_model, allow_dangerous_deserialization=True)
            print("Векторная база загружена.")

        if vector_db:
            # Берем ввод из глобальной переменной, если она задана, иначе используем значение по умолчанию
            query = user_input if 'user_input' in globals() else "Как настроить вебхук?"
            print(f"\nВопрос: {query}")

            if is_task_query(query):
                print("Запрос отклонен: решение учебных задач запрещено.")
            else:
                docs = vector_db.similarity_search(query, k=3)
                context_text = "\n".join([d.page_content for d in docs])
                full_prompt = f"Контекст:\n{context_text}\n\nВопрос: {query}"

                answer = send_to_gigachat(full_prompt, token)
                print(f"Ответ GigaChat: {answer}")