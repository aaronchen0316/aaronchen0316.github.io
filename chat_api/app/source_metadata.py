from __future__ import annotations

import re


def infer_profile_category(source_file: str) -> str:
    filename = source_file.lower()
    if filename == "resume_education_skills.md":
        return "education_skills"
    if filename == "resume_industry_experience.md":
        return "industry_experience"
    if filename == "resume_research_experience.md":
        return "research_experience"
    if filename == "resume_projects.md":
        return "resume_projects"
    if filename == "resume_summary.md":
        return "resume_summary"
    if filename == "projects.md":
        return "projects"
    if filename == "experience.md":
        return "experience_themes"
    if filename == "overview.md":
        return "overview"
    if filename == "hobbies.md":
        return "hobbies_contact"
    return "profile"


def extract_markdown_metadata(text: str, source_file: str) -> dict[str, str]:
    source_title = ""
    section_titles: list[str] = []

    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith("# ") and not source_title:
            source_title = stripped[2:].strip()
        elif stripped.startswith("## "):
            section_titles.append(stripped[3:].strip())

    return {
        "source_title": source_title or source_file,
        "section_titles": " | ".join(section_titles),
        "profile_category": infer_profile_category(source_file),
    }
