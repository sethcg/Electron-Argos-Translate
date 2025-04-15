# FOR PYTHON TYPES
from __future__ import annotations

from pathlib import Path
from typing import List, Optional

# https://github.com/OpenNMT/CTranslate2
# Python library for efficient inference with Transformer models
import ctranslate2

# https://spacy.io/models/xx#xx_sent_ud_sm
# Multi-language pipeline optimized for CPU
# import xx_sent_ud_sm
from spacy.util import load_model_from_path

from functions import package

class Hypothesis:
    """
    Represents a translation hypothesis
    Attributes:
        value: The hypothetical translation value
        score: The score representing the quality of the translation
    """

    value: str
    score: float

    def __init__(self, value: str, score: float):
        self.value = value
        self.score = score

    def __lt__(self, other):
        return self.score < other.score

    def __repr__(self):
        return f"({repr(self.value)}, {self.score})"

    def __str__(self):
        return repr(self)

class Language:
    """
    Represents a language that can be translated from/to.
    Attributes:
        code: The code representing the language.
        name: The human readable name of the language.
        translations_from: A list of the translations that translate from this language.
        translations_to: A list of the translations that translate to this language
    """

    translations_from: list[ITranslation] = []
    translations_to: list[ITranslation] = []

    def __init__(self, code: str, name: str):
        self.code = code
        self.name = name
        self.translations_from = []
        self.translations_to = []

    def __str__(self):
        return self.name

    def get_translation(self, to: Language) -> ITranslation | None:
        """
        Gets a translation from this Language to another Language.
        Args:
            to: The Language to look for a Translation to.
        Returns:
            A valid Translation if there is one in translations_from else None.
        """
        valid_translations = list(filter(lambda x: x.to_lang.code == to.code, self.translations_from))
        if len(valid_translations) > 0:
            return valid_translations[0]
        return None

class ITranslation:
    """
    Represents a translation between two Languages
    Attributes:
        from_lang: The Language this Translation translates from.
        to_lang: The Language this Translation translates to.
    """

    from_lang: Language
    to_lang: Language

    def translate(self, input_text: str) -> str:
        """
        Translates a string from self.from_lang to self.to_lang
        Args:
            input_text: The text to be translated.
        Returns:
            input_text translated.
        """
        return self.hypotheses(input_text, num_hypotheses = 1)[0].value

    @staticmethod
    def split_into_paragraphs(input_text: str) -> list[str]:
        """
        Splits input_text into paragraphs and returns a list of paragraphs.
        Args:
            input_text: The text to be split.
        Returns:
            A list of paragraphs.
        """
        return input_text.split("\n")

    @staticmethod
    def combine_paragraphs(paragraphs: list[str]) -> str:
        """
        Combines a list of paragraphs together.
        Args:
            paragraphs: A list of paragraphs.
        Returns:
            list of n paragraphs combined into one string.
        """
        return "\n".join(paragraphs)

class PackageTranslation(ITranslation):
    """A Translation that is installed with a package"""

    def __init__(self, from_lang: Language, to_lang: Language, pkg: package.Package, sentencizer: SpacySentencizerSmall, inter_threads: int):
        self.from_lang = from_lang
        self.to_lang = to_lang
        self.pkg = pkg
        self.translator = None
        self.sentencizer = sentencizer
        self.inter_threads = inter_threads

    def hypotheses(self, input_text: str, num_hypotheses: int = 4) -> list[Hypothesis]:
        if self.translator is None:
            model_path = str(self.pkg.package_path / "model")
            self.translator = ctranslate2.Translator(
                model_path,
                # "cpu" or "cuda"
                device = "cpu",
                inter_threads = self.inter_threads,
                intra_threads = 0,
            )
        paragraphs = ITranslation.split_into_paragraphs(input_text)
        translated_paragraphs = []
        for paragraph in paragraphs:
            translated_paragraphs.append(
                apply_packaged_translation(
                    self.pkg,
                    paragraph,
                    self.translator,
                    self.sentencizer,
                    num_hypotheses,
                )
            )

        # Construct new hypotheses using all paragraphs
        hypotheses_to_return = [Hypothesis("", 0) for i in range(num_hypotheses)]
        for i in range(num_hypotheses):
            for translated_paragraph in translated_paragraphs:
                value = ITranslation.combine_paragraphs(
                    [hypotheses_to_return[i].value, translated_paragraph[i].value]
                )
                score = hypotheses_to_return[i].score + translated_paragraph[i].score
                hypotheses_to_return[i] = Hypothesis(value, score)
            hypotheses_to_return[i].value = hypotheses_to_return[i].value.lstrip("\n")
        return hypotheses_to_return

class IdentityTranslation(ITranslation):
    """A Translation that doesn't modify input_text."""

    def __init__(self, lang: Language):
        """
        Creates an IdentityTranslation.
        Args:
            lang: The Language this Translation translates from and to.
        """
        self.from_lang = lang
        self.to_lang = lang

    def hypotheses(self, input_text: str, num_hypotheses: int = 4):
        return [Hypothesis(input_text, 0) for i in range(num_hypotheses)]

class CompositeTranslation(ITranslation):
    """
    A ITranslation that is performed by chaining two Translations
    Attributes:
        t1: The first Translation to apply.
        t2: The second Translation to apply.
    """

    t1: ITranslation
    t2: ITranslation
    from_lang: Language
    to_lang: Language

    def __init__(self, t1: ITranslation, t2: ITranslation):
        """
        Creates a CompositeTranslation.
        Args:
            t1: The first Translation to apply.
            t2: The second Translation to apply.
        """
        self.t1 = t1
        self.t2 = t2
        self.from_lang = t1.from_lang
        self.to_lang = t2.to_lang

    def hypotheses(self, input_text: str, num_hypotheses: int = 4) -> list[Hypothesis]:
        t1_hypotheses = self.t1.hypotheses(input_text, num_hypotheses)

        # Combine hypotheses
        # O(n^2)
        to_return = []
        for t1_hypothesis in t1_hypotheses:
            t2_hypotheses = self.t2.hypotheses(t1_hypothesis.value, num_hypotheses)
            for t2_hypothesis in t2_hypotheses:
                to_return.append(
                    Hypothesis(
                        t2_hypothesis.value, t1_hypothesis.score + t2_hypothesis.score
                    )
                )
        to_return.sort(reverse=True)
        return to_return[0:num_hypotheses]

class CachedTranslation(ITranslation):
    """
    Caches a translation to improve performance.

    This is done by splitting up the text passed for translation
    into paragraphs and translating each paragraph individually.
    A hash of the paragraphs and their corresponding translations
    are saved from the previous translation and used to improve
    performance on the next one. This is especially useful if you
    are repeatedly translating nearly identical text with a small
    change at the end of it.
    """

    underlying: ITranslation
    from_lang: Language
    to_lang: Language
    cache: dict

    def __init__(self, underlying: ITranslation):
        """Creates a CachedTranslation.

        Args:
            underlying: The underlying translation to cache.
        """
        self.underlying = underlying
        self.from_lang = underlying.from_lang
        self.to_lang = underlying.to_lang
        self.cache = dict()

    def hypotheses(self, input_text: str, num_hypotheses: int = 4) -> list[Hypothesis]:
        new_cache = dict()  # 'text': ['t1'...('tN')]
        paragraphs = ITranslation.split_into_paragraphs(input_text)
        translated_paragraphs = []
        for paragraph in paragraphs:
            translated_paragraph = self.cache.get(paragraph)
            # If len() of our cached items are different than `num_hypotheses` it means that
            # the search parameter is changed by caller, so we can't re-use cache, and should update it.
            if (
                translated_paragraph is None
                or len(translated_paragraph) != num_hypotheses
            ):
                translated_paragraph = self.underlying.hypotheses(
                    paragraph, num_hypotheses
                )
            new_cache[paragraph] = translated_paragraph
            translated_paragraphs.append(translated_paragraph)
        self.cache = new_cache

        # Construct hypotheses
        hypotheses_to_return = [Hypothesis("", 0) for i in range(num_hypotheses)]
        for i in range(num_hypotheses):
            for j in range(len(translated_paragraphs)):
                value = ITranslation.combine_paragraphs(
                    [hypotheses_to_return[i].value, translated_paragraphs[j][i].value]
                )
                score = (
                    hypotheses_to_return[i].score + translated_paragraphs[j][i].score
                )
                hypotheses_to_return[i] = Hypothesis(value, score)
            hypotheses_to_return[i].value = hypotheses_to_return[i].value.lstrip("\n")
        return hypotheses_to_return

class ISentenceBoundaryDetectionModel:
    # https://github.com/argosopentech/sbd/blob/main/main.py
    def split_sentences(self, text: str, lang_code: Optional[str] = None) -> List[str]:
        raise NotImplementedError

class SpacySentencizerSmall(ISentenceBoundaryDetectionModel):
    def __init__(self, sentencizer_path: Path):
        self.nlp = load_model_from_path(sentencizer_path, exclude = ["parser"])
        self.nlp.add_pipe("sentencizer")

    def split_sentences(self, text: str, lang_code: Optional[str] = None) -> List[str]:
        doc = self.nlp(text)
        return [sent.text for sent in doc.sents]

def apply_packaged_translation(
    pkg: package.Package,
    input_text: str,
    translator: ctranslate2.Translator,
    sentencizer: ISentenceBoundaryDetectionModel,
    num_hypotheses: int = 4,
) -> list[Hypothesis]:
    """
    Applies the translation in pkg to translate input_text.
    Args:
        pkg: The package that provides the translation.
        input_text: The text to be translated.
        translator: The CTranslate2 Translator
        sentencizer: The Spacy sentencizer,
        num_hypotheses: The number of hypotheses to generate
    Returns:
        A list of Hypothesis's for translating input_text
    """
    sentences = sentencizer.split_sentences(input_text)

    # Tokenization
    tokenized = [pkg.tokenizer.encode(sentence) for sentence in sentences]

    # Translation
    BATCH_SIZE = 32

    translated_batches = translator.translate_batch(
        tokenized,
        target_prefix = None,
        replace_unknowns = True,
        max_batch_size = BATCH_SIZE,
        beam_size = max(num_hypotheses, 4),
        num_hypotheses = num_hypotheses,
        length_penalty = 0.2,
        return_scores = True,
    )

    # Build hypotheses
    value_hypotheses = []
    for i in range(num_hypotheses):
        translated_tokens = []
        cumulative_score = 0
        for translated_batch in translated_batches:
            translated_tokens += translated_batch.hypotheses[i]
            cumulative_score += translated_batch.scores[i]

        value = pkg.tokenizer.decode(translated_tokens)

        if len(value) > 0 and value[0] == " ":
            # Remove space at the beginning of the translation added by the tokenizer.
            value = value[1:]

        hypothesis = Hypothesis(value, cumulative_score)
        value_hypotheses.append(hypothesis)
    return value_hypotheses