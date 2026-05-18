from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path


def log_metric(path: Path, *, topic: str, latency_ms: int, success: bool, source_count: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "topic": topic,
        "latency_ms": latency_ms,
        "success": success,
        "source_count": source_count,
    }
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(entry) + "\n")
