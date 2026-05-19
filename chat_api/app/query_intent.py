from __future__ import annotations

from dataclasses import dataclass
import re


BLOCKED_TOPIC_KEYWORDS = {
    "contact": {"contact", "email", "reach", "collaboration"},
    "education": {"education", "degree", "degrees", "school", "university", "college", "advisor", "thesis"},
    "hobby": {"hobby", "hobbies", "photography", "travel", "sports", "home projects"},
    "paper": {"paper", "papers", "publication", "publications", "study", "studies"},
    "project": {"project", "projects", "software", "tool", "tooling", "platform", "workflow", "workflows", "chatbot", "portfolio"},
    "research": {"research", "materials", "simulation", "gallium nitride", "active learning", "machine learning"},
    "work": {"experience", "worked", "role", "job", "intern", "employer", "career", "responsibilities"},
}

QUERY_ALIAS_EXPANSIONS = {
    r"\bucsd\b": "University of California San Diego undergraduate research education degree period",
    r"\buc san diego\b": "University of California San Diego undergraduate research education degree period",
    r"\bjhu\b": "Johns Hopkins University doctoral research PhD thesis advisor period",
    r"\bslb\b": "Schlumberger drilling analytics membrane experiments carbon capture",
    r"\bph\.?d\b": "PhD doctor of philosophy thesis doctoral research chemical engineering",
    r"\bm\.?s\.?\b": "MS master of science graduate research chemical engineering",
    r"\bb\.?s\.?\b": "BS bachelor of science undergraduate education chemical engineering",
    r"\bcgcnn\b": "crystal graph convolutional neural network CGCNN",
    r"\bco2\b": "carbon dioxide CO2",
}

PHRASE_HINTS = {
    "attend": "education attendance dates period degree",
    "education history": "education degrees schools universities graduation",
    "finish his bs": "education bachelor degree graduation date",
    "finish her bs": "education bachelor degree graduation date",
    "join schlumberger": "Schlumberger role period August 2023 to present",
    "what did aaron do at": "experience role responsibilities period",
    "intern at": "internship period responsibilities",
    "advisor": "advisor professor research group",
    "advised": "advisor professor research group",
    "thesis": "thesis title degree outcome",
    "master's thesis": "master thesis Cornell graduate research",
    "phd thesis": "doctoral thesis Johns Hopkins research",
    "education": "education degree university school graduation",
    "programming languages": "skills Python SQL PyTorch TensorFlow",
    "ml tools": "skills PyTorch TensorFlow Scikit-learn",
    "organic crystal habit": "A comprehensive picture of roughness evolution in organic crystalline growth molecular aspect ratio",
    "naphthalene tetracarboxylic diimide": "Solvent Molecule Interactions Govern Crystal Habit Selection in Naphthalene Tetracarboxylic Diimides",
    "rag paper prototype": "project prototype retrieval Chroma chat API",
    "undergraduate researcher": "undergraduate researcher University of California San Diego period September 2014 to June 2017 nanoparticle therapeutics",
    "research areas": "overview focus areas materials science applied ai",
}

CANONICAL_PHRASES = {
    "Aionics": ("aionics",),
    "Bayesian optimization": ("bayesian optimization",),
    "CGCNN": ("cgcnn", "crystal graph convolutional neural network"),
    "Chemical Engineering": ("chemical engineering",),
    "Corning": ("corning",),
    "Cornell University": ("cornell", "cornell university"),
    "Johns Hopkins University": ("johns hopkins", "johns hopkins university", "jhu"),
    "Professor Paulette Clancy": ("paulette clancy", "professor paulette clancy"),
    "Schlumberger": ("schlumberger", "slb"),
    "University of California San Diego": ("university of california san diego", "ucsd", "uc san diego"),
}

STOPWORDS = {
    "a",
    "about",
    "aaron",
    "an",
    "and",
    "at",
    "can",
    "did",
    "do",
    "does",
    "earn",
    "finish",
    "for",
    "he",
    "her",
    "his",
    "how",
    "i",
    "in",
    "is",
    "kind",
    "me",
    "of",
    "on",
    "tell",
    "the",
    "their",
    "they",
    "to",
    "use",
    "uses",
    "what",
    "when",
    "where",
    "who",
}


@dataclass(frozen=True)
class QuerySignals:
    original_query: str
    normalized_query: str
    terms: tuple[str, ...]
    canonical_phrases: tuple[str, ...]
    is_contact: bool
    is_education: bool
    is_hobby: bool
    is_paper_specific: bool
    is_profile: bool
    is_project: bool
    is_research: bool
    is_work_history: bool


def analyze_query(query: str) -> QuerySignals:
    normalized_query = normalize_query_for_retrieval(query)
    lowered = normalized_query.lower()
    original_lowered = query.lower()

    is_contact = _contains_any(lowered, BLOCKED_TOPIC_KEYWORDS["contact"])
    is_education = _contains_any(lowered, BLOCKED_TOPIC_KEYWORDS["education"]) or bool(
        re.search(r"\b(phd|m\.s\.|ms|b\.s\.|bs)\b", lowered)
    )
    is_hobby = _contains_any(lowered, BLOCKED_TOPIC_KEYWORDS["hobby"])
    is_project = _contains_any(lowered, BLOCKED_TOPIC_KEYWORDS["project"])
    is_paper_specific = (_contains_any(lowered, BLOCKED_TOPIC_KEYWORDS["paper"]) or "paper about" in lowered) and not is_project
    is_research = _contains_any(lowered, BLOCKED_TOPIC_KEYWORDS["research"]) or is_paper_specific
    is_work_history = _contains_any(lowered, BLOCKED_TOPIC_KEYWORDS["work"]) or _mentions_employer(lowered)
    is_profile = is_contact or is_education or is_hobby or is_project or is_work_history or _mentions_school(lowered)

    terms = tuple(
        term
        for term in dict.fromkeys(re.findall(r"[a-z0-9]+", lowered))
        if term not in STOPWORDS and len(term) >= 3
    )
    canonical_phrases = tuple(
        phrase
        for phrase, aliases in CANONICAL_PHRASES.items()
        if any(alias in lowered or alias in original_lowered for alias in aliases)
    )

    return QuerySignals(
        original_query=query,
        normalized_query=normalized_query,
        terms=terms,
        canonical_phrases=canonical_phrases,
        is_contact=is_contact,
        is_education=is_education,
        is_hobby=is_hobby,
        is_paper_specific=is_paper_specific,
        is_profile=is_profile,
        is_project=is_project,
        is_research=is_research,
        is_work_history=is_work_history,
    )


def normalize_query_for_retrieval(query: str) -> str:
    lowered = query.lower()
    expansions: list[str] = [query.strip()]

    for pattern, expansion in QUERY_ALIAS_EXPANSIONS.items():
        if re.search(pattern, lowered):
            expansions.append(expansion)

    for phrase, hint in PHRASE_HINTS.items():
        if phrase in lowered:
            expansions.append(hint)

    if _mentions_school(lowered):
        expansions.append("education degree school university advisor thesis period")
    if _mentions_employer(lowered):
        expansions.append("work experience role employer responsibilities period")
    if "gallium nitride" in lowered:
        expansions.append("paper crystal growth active machine learning transferable force field diffusion limited")

    return " ".join(dict.fromkeys(part for part in expansions if part))


def _contains_any(text: str, phrases: set[str]) -> bool:
    return any(phrase in text for phrase in phrases)


def _mentions_employer(text: str) -> bool:
    return any(name in text for name in ("schlumberger", "slb", "corning", "aionics"))


def _mentions_school(text: str) -> bool:
    return any(
        name in text
        for name in ("university of california san diego", "ucsd", "uc san diego", "johns hopkins", "cornell")
    )
