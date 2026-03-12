import tempfile
import shutil
from pathlib import Path
from git import Repo

def clone_github_repo(url: str) -> Path:
    temp_dir = Path(tempfile.mkdtemp())
    repo_path = temp_dir / 'repo'
    Repo.clone_from(url, repo_path)
    return repo_path

def get_python_files(repo_path: Path) -> list[Path]:
    return list(repo_path.rglob('*.py'))

def cleanup_repo(repo_path: Path):
    shutil.rmtree(repo_path.parent)
