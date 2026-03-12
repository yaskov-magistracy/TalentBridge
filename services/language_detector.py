from pathlib import Path
from collections import Counter

LANGUAGE_EXTENSIONS = {
    'python': ['.py'],
    'javascript': ['.js', '.jsx', '.ts', '.tsx'],
    'java': ['.java'],
    'cpp': ['.cpp', '.c', '.h', '.hpp'],
    'go': ['.go'],
    'rust': ['.rs'],
    'php': ['.php'],
    'ruby': ['.rb'],
    'swift': ['.swift'],
    'kotlin': ['.kt']
}

def detect_language(repo_path: Path) -> str:
    """Определяет основной язык проекта по расширениям файлов"""
    all_files = list(repo_path.rglob('*'))
    extensions = [f.suffix.lower() for f in all_files if f.suffix]
    
    lang_counter = Counter()
    for ext in extensions:
        for lang, exts in LANGUAGE_EXTENSIONS.items():
            if ext in exts:
                lang_counter[lang] += 1
                break
    
    if lang_counter:
        dominant_lang = lang_counter.most_common(1)[0][0]
        return dominant_lang
    return 'unknown'
