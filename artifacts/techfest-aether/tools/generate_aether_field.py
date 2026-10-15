#!/usr/bin/env python3
"""Compile the C particle generator and publish a small deterministic JSON field."""

from __future__ import annotations

import json
import math
import os
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src" / "engine" / "aether_particles.c"
OUTPUT = ROOT / "public" / "data" / "aether-field.json"
PARTICLE_COUNT = 1800


def main() -> None:
    compiler = os.environ.get("CC") or shutil.which("cc") or shutil.which("gcc")
    if not compiler:
        raise SystemExit(
            "A C compiler (cc or gcc) is required to generate the Aether particle field."
        )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="techfest-aether-") as temporary:
        executable = Path(temporary) / "aether-particles"
        subprocess.run(
            [compiler, "-std=c11", "-O2", str(SOURCE), "-lm", "-o", str(executable)],
            check=True,
        )
        generated = subprocess.run(
            [str(executable), str(PARTICLE_COUNT)],
            check=True,
            capture_output=True,
            text=True,
        )

    payload = json.loads(generated.stdout)
    particles = payload.get("particles")
    if not isinstance(particles, list) or len(particles) != PARTICLE_COUNT:
        raise SystemExit("C generator returned an unexpected particle count.")
    if any(
        not isinstance(point, list)
        or len(point) != 5
        or not all(isinstance(value, (int, float)) and math.isfinite(value) for value in point)
        for point in particles
    ):
        raise SystemExit("C generator returned an invalid particle coordinate.")

    OUTPUT.write_text(
        json.dumps(
            {
                "generator": "C11",
                "count": len(particles),
                "particles": particles,
            },
            separators=(",", ":"),
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(particles)} deterministic Aether points to {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
