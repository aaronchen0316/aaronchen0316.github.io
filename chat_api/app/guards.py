from __future__ import annotations

from dataclasses import dataclass


SUPPORTED_KEYWORDS = {
    "research": {"research", "paper", "papers", "publication", "publications", "materials", "gallium", "gan", "simulation"},
    "engineering": {"project", "projects", "software", "engineering", "app", "tool", "rag", "website", "chatbot", "code"},
    "experience": {"experience", "background", "work", "focus", "strength", "skills", "technical", "build"},
    "hobbies": {"hobby", "hobbies", "photography", "travel", "sports", "home project"},
    "contact": {"contact", "email", "reach", "collaboration"},
}

BLOCKED_KEYWORDS = {
    "politics",
    "religion",
    "dating",
    "relationship",
    "salary",
    "address",
    "phone number",
    "social security",
    "vote",
    "party affiliation",
    "medical record",
}


@dataclass(frozen=True)
class ScopeDecision:
    supported: bool
    topic: str
    reply_hint: str


def classify_topic(query: str) -> str:
    normalized = query.lower()
    for topic, keywords in SUPPORTED_KEYWORDS.items():
        if any(keyword in normalized for keyword in keywords):
            return topic
    return "general"


def evaluate_scope(query: str) -> ScopeDecision:
    normalized = query.lower()
    if any(keyword in normalized for keyword in BLOCKED_KEYWORDS):
        return ScopeDecision(
            supported=False,
            topic="blocked",
            reply_hint="I can help with Aaron's research, projects, technical background, and contact details only.",
        )

    topic = classify_topic(query)
    if topic == "general" and not any(phrase in normalized for phrase in {"what does aaron", "who is aaron", "tell me about aaron"}):
        return ScopeDecision(
            supported=False,
            topic="unsupported",
            reply_hint="Ask about Aaron's research, papers, projects, experience, hobbies, or contact details.",
        )

    return ScopeDecision(supported=True, topic=topic, reply_hint="")
