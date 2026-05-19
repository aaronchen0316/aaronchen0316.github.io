from __future__ import annotations

from dataclasses import dataclass

from app.query_intent import analyze_query


BLOCKED_KEYWORDS = {
    "politics",
    "political party",
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
    "medical records",
    "social security number",
    "ssn",
    "where does aaron live",
    "where is aaron located",
}

MIN_TOP_SCORE = 0.34
MIN_TOP_TWO_AVG_SCORE = 0.31
STRONG_SINGLE_SCORE = 0.44


@dataclass(frozen=True)
class ScopeDecision:
    supported: bool
    topic: str
    reply_hint: str
    reason: str


def detect_blocked_query(query: str) -> ScopeDecision | None:
    normalized = query.lower()
    if any(keyword in normalized for keyword in BLOCKED_KEYWORDS):
        return ScopeDecision(
            supported=False,
            topic="blocked",
            reply_hint="I can help with Aaron's research, projects, technical background, and contact details only.",
            reason="blocked_keyword",
        )
    return None


def evaluate_retrieval_scope(query: str, results: list[dict]) -> ScopeDecision:
    if not results:
        return ScopeDecision(
            supported=False,
            topic="unsupported",
            reply_hint="I do not have enough grounded context for that yet. Ask about Aaron's papers, projects, experience, hobbies, or contact details.",
            reason="no_results",
        )

    query_signals = analyze_query(query)
    top_score = max(_score(doc) for doc in results)
    top_two = results[:2]
    top_two_average = sum(_score(doc) for doc in top_two) / len(top_two)

    expects_profile = query_signals.is_profile or query_signals.is_education or query_signals.is_work_history
    top_profile_results = [doc for doc in top_two if str(doc["metadata"].get("source_kind")) == "profile"]

    if expects_profile and not top_profile_results:
        return ScopeDecision(
            supported=False,
            topic="unsupported",
            reply_hint="I can answer questions grounded in Aaron's education, experience, projects, papers, hobbies, or contact details when that information is present in the profile corpus.",
            reason="missing_profile_evidence",
        )

    has_strong_single = top_score >= STRONG_SINGLE_SCORE
    has_consistent_evidence = top_score >= MIN_TOP_SCORE and top_two_average >= MIN_TOP_TWO_AVG_SCORE

    if not (has_strong_single or has_consistent_evidence):
        return ScopeDecision(
            supported=False,
            topic="unsupported",
            reply_hint="I do not have enough grounded context for that yet. Ask about Aaron's papers, projects, experience, hobbies, or contact details.",
            reason="insufficient_evidence",
        )

    return ScopeDecision(
        supported=True,
        topic=infer_topic(query, results),
        reply_hint="",
        reason="retrieval_evidence",
    )


def infer_topic(query: str, results: list[dict]) -> str:
    query_signals = analyze_query(query)
    top_sources = results[:2]

    if any(str(doc["metadata"].get("source_kind")) == "paper" for doc in top_sources):
        return "research"
    if query_signals.is_hobby:
        return "hobbies"
    if query_signals.is_contact:
        return "contact"
    if query_signals.is_profile:
        return "experience"
    return "general"


def _score(result: dict) -> float:
    return float(result.get("ranking_score", result["similarity_score"]))
