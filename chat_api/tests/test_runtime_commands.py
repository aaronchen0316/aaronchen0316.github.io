from __future__ import annotations

import subprocess
import time
import unittest
import urllib.request
import json
from pathlib import Path


CHAT_API_ROOT = Path(__file__).resolve().parents[1]
VENV_PYTHON = CHAT_API_ROOT / ".venv" / "bin" / "python"
INGEST_TIMEOUT_SECONDS = 60


class RuntimeCommandTests(unittest.TestCase):
    def test_ingest_command_succeeds(self) -> None:
        try:
            completed = subprocess.run(
                [str(VENV_PYTHON), "-m", "app.ingest"],
                cwd=CHAT_API_ROOT,
                capture_output=True,
                text=True,
                check=False,
                timeout=INGEST_TIMEOUT_SECONDS,
            )
        except subprocess.TimeoutExpired as exc:
            self.fail(
                f"`python -m app.ingest` did not finish within {INGEST_TIMEOUT_SECONDS}s. "
                f"stdout={exc.stdout!r} stderr={exc.stderr!r}"
            )

        self.assertEqual(completed.returncode, 0, completed.stderr)
        self.assertIn("Ingested", completed.stdout)

    def test_uvicorn_serves_health_endpoint(self) -> None:
        process = subprocess.Popen(
            [
                str(VENV_PYTHON),
                "-m",
                "uvicorn",
                "app.server:app",
                "--host",
                "127.0.0.1",
                "--port",
                "8011",
            ],
            cwd=CHAT_API_ROOT,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

        try:
            deadline = time.time() + 15
            last_error: Exception | None = None

            while time.time() < deadline:
                if process.poll() is not None:
                    stdout, stderr = process.communicate()
                    self.fail(
                        f"`uvicorn app.server:app` exited before serving /health. "
                        f"stdout={stdout!r} stderr={stderr!r}"
                    )

                try:
                    with urllib.request.urlopen("http://127.0.0.1:8011/health", timeout=2) as response:
                        payload = json.load(response)
                    self.assertEqual(payload["status"], "ok")
                    self.assertIn("index_ready", payload)
                    return
                except Exception as exc:
                    last_error = exc
                    time.sleep(0.5)

            self.fail(f"`uvicorn app.server:app` did not serve /health in time: {last_error!r}")
        finally:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait(timeout=5)


if __name__ == "__main__":
    unittest.main()
