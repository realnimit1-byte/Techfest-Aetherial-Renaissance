#!/usr/bin/env python3
"""Serve the built static experience with Python's standard library."""

from __future__ import annotations

import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUILD = ROOT / "dist" / "public"
PORT = int(os.environ.get("PORT", "8000"))


def main() -> None:
    if not BUILD.is_dir():
        raise SystemExit("Build the website first: pnpm --filter @workspace/techfest-aether run build")
    if not 1 <= PORT <= 65535:
        raise SystemExit("PORT must be between 1 and 65535.")

    handler = partial(SimpleHTTPRequestHandler, directory=str(BUILD))
    server = ThreadingHTTPServer(("0.0.0.0", PORT), handler)
    print(f"Serving the static Techfest experience at http://0.0.0.0:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
