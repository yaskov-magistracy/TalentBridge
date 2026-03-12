from celery import shared_task
from services.github_service import clone_github_repo, get_python_files, cleanup_repo
from services.code_analyzer import check_pep8
from services.language_detector import detect_language
from services.gigachat_service import analyze_best_practices
from api.models import AnalysisReport

@shared_task(bind=True)
def analyze_github_repo(self, github_url: str, task_id: str = None):
    repo_path = None
    try:
        # Клонирование и анализирование
        repo_path = clone_github_repo(github_url)
        py_files = get_python_files(repo_path)
        language = detect_language(repo_path)
        
        # PEP8 или базовая статистика
        pep8_results = [check_pep8(f) for f in py_files[:15]]
        avg_pep8 = sum(r['score'] for r in pep8_results) / len(pep8_results)
        
        # Топ файлы для передачи на ИИ-анализ
        code_snippets = []
        large_files = sorted(py_files[:10], key=lambda f: f.stat().st_size, reverse=True)[:3]
        for f in large_files:
            try:
                code_snippets.append(f.read_text()[:1500])
            except:
                pass
        
        # GigaChat анализ согласно Best Practices
        bp_analysis = analyze_best_practices(code_snippets, language, avg_pep8)
        
        # Сохранение в БД
        report = AnalysisReport.objects.create(
            task_id=task_id or self.request.id,
            github_url=github_url,
            language=language,
            pep8_score=avg_pep8 if language == 'python' else None,
            best_practices_score=bp_analysis['score'],
            files_analyzed=len(py_files),
            status='completed'
        )
        
        return {
            'report_id': report.id,
            'language': language,
            'pep8_score': round(avg_pep8, 3) if language == 'python' else None,
            'best_practices_score': bp_analysis['score'],
            'details': bp_analysis['details']
        }
        
    except Exception as exc:
        if repo_path:
            cleanup_repo(repo_path)
        raise self.retry(exc=exc, countdown=60)
