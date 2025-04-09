import copy
import json
from pathlib import Path
from threading import Lock
from functions.tokenizer import BPETokenizer, SentencePieceTokenizer

# Hold lock while installing or uninstalling packages
package_lock = Lock()

class IPackage:
    """A package, containing the meta data and translation model."""

    package_path: Path
    sentencizer_path: Path
    package_version: str
    argos_version: str
    from_code: str
    from_name: str
    to_code: str
    to_name: str
    languages: list
    source_languages: list
    target_languages: list

    def load_metadata_from_json(self, metadata):
        """Loads package metadata from a JSON object.
        Args:
            metadata: A json object from json.load
        """
        self.package_version = metadata.get("package_version", "")
        self.argos_version = metadata.get("argos_version", "")
        self.from_code = metadata.get("from_code")
        self.from_name = metadata.get("from_name", "")
        self.to_code = metadata.get("to_code")
        self.to_name = metadata.get("to_name", "")
        self.languages = metadata.get("languages", list())
        self.source_languages = metadata.get("source_languages", list())
        self.target_languages = metadata.get("target_languages", list())

        # Add all package source and target languages to "source_languages" and "target_languages"
        if self.from_code is not None or self.from_name is not None:
            from_lang = dict()
            if self.from_code is not None:
                from_lang["code"] = self.from_code
            if self.from_name is not None:
                from_lang["name"] = self.from_name
            self.source_languages.append(from_lang)
        if self.to_code is not None or self.to_name is not None:
            to_lang = dict()
            if self.to_code is not None:
                to_lang["code"] = self.to_code
            if self.to_name is not None:
                to_lang["name"] = self.to_name
            self.source_languages.append(to_lang)
        self.source_languages += copy.deepcopy(self.languages)
        self.target_languages += copy.deepcopy(self.languages)

class Package(IPackage):
    """An installed package"""

    def __init__(self, package_path: Path):
        """
        Create a new Package from path.
        Args:
            package_path: Path to installed package directory.
        """
        
        if type(package_path) == str:
            package_path = Path(package_path)
        self.package_path = package_path

        metadata_path = package_path / "metadata.json"
        if not metadata_path.exists():
            raise FileNotFoundError("Error opening package at " + str(metadata_path) + " no metadata.json")
        with open(metadata_path) as metadata_file:
            metadata = json.load(metadata_file)
            self.load_metadata_from_json(metadata)

        sp_model_path = package_path / "sentencepiece.model"
        bpe_model_path = package_path / "bpe.model"

        if sp_model_path.exists():
            self.tokenizer = SentencePieceTokenizer(sp_model_path)
        elif bpe_model_path.exists():
            self.tokenizer = BPETokenizer(bpe_model_path, self.from_code, self.to_code)

def get_installed_packages(str_package_path: str) -> list[Package]:
    package_path = Path(str_package_path)

    with package_lock:
        to_return = []
        for filePath in package_path.iterdir():
            to_return.append(Package(filePath))
        return to_return