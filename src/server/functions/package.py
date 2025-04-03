from pathlib import Path
from threading import Lock
from argostranslate.package import Package

# Threading logic
# Hold lock while installing or uninstalling packages
package_lock = Lock()

def get_installed_packages(str_path: str) -> list[Package]:
    path = Path(str_path)

    with package_lock:
        to_return = []
        for filePath in path.iterdir():
            to_return.append(Package(filePath))
        return to_return