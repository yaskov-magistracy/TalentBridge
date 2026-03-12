import subprocess
from pathlib import Path

def check_pep8(file_path: Path) -> dict:
    if not file_path.exists() or file_path.stat().st_size == 0:
        return {'violations': 0, 'score': 1.0, 'total_lines': 0}
    
    try:
        result = subprocess.run(
            ['flake8', str(file_path), '--count'], 
            capture_output=True, text=True, timeout=30
        )
        violations = int(result.stdout.split()[-1]) if result.stdout.strip() else 0
        total_lines = len(file_path.read_text().splitlines())
        score = max(0, 1.0 - (violations / max(total_lines, 1)))
        return {
            'violations': violations, 
            'score': round(score, 3), 
            'total_lines': total_lines
        }
    except Exception:
        return {'violations': 0, 'score': 0.0, 'total_lines': 0}
