from __future__ import annotations

from pathlib import Path
from typing import Sequence

from langchain_community.document_loaders import PyPDFLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter


DEFAULT_CHUNK_SIZE = 900
DEFAULT_CHUNK_OVERLAP = 180


def _discover_files(directory: Path, pattern: str) -> list[Path]:
    if not directory.exists():
        return []
    return sorted(path for path in directory.glob(pattern) if path.is_file())


def load_profile_documents(profile_directory: Path) -> list[Document]:
    documents: list[Document] = []
    for file_path in _discover_files(profile_directory, "*.md"):
        text = file_path.read_text(encoding="utf-8").strip()
        if not text:
            continue
        documents.append(
            Document(
                page_content=text,
                metadata={
                    "source_file": file_path.name,
                    "source_kind": "profile",
                    "page": 0,
                },
            )
        )
    return documents


def load_pdf_documents(pdf_directory: Path) -> list[Document]:
    documents: list[Document] = []
    for pdf_file in _discover_files(pdf_directory, "*.pdf") + _discover_files(pdf_directory, "*.PDF"):
        loader = PyPDFLoader(str(pdf_file))
        loaded = loader.load()
        for doc in loaded:
            doc.metadata["source_file"] = pdf_file.name
            doc.metadata["source_kind"] = "paper"
        documents.extend(loaded)
    return documents


def split_documents(
    documents: Sequence[Document],
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    chunk_overlap: int = DEFAULT_CHUNK_OVERLAP,
) -> list[Document]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    chunks = splitter.split_documents(list(documents))
    counts: dict[tuple[str, int], int] = {}
    for chunk in chunks:
        source = str(chunk.metadata.get("source_file", "unknown"))
        page = int(chunk.metadata.get("page", 0))
        key = (source, page)
        chunk.metadata["chunk_index"] = counts.get(key, 0)
        counts[key] = counts.get(key, 0) + 1
    return chunks


def build_corpus(profile_directory: Path, pdf_directory: Path) -> list[Document]:
    profile_docs = load_profile_documents(profile_directory)
    pdf_docs = load_pdf_documents(pdf_directory)
    documents = profile_docs + pdf_docs
    if not documents:
        raise ValueError("No profile docs or PDFs found for ingestion.")
    return split_documents(documents)
