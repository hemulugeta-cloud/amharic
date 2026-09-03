#!/usr/bin/env python3
"""
Regenerates js/app.bundle.js from the modular source files (js/auth.js,
js/data-ported.js, js/data-new.js, js/app.js).

Why this exists: index.html loads js/app.bundle.js with a plain <script>
tag (not type="module") so the app works by double-clicking index.html
directly (file://) with no local server. Browsers block ES module
imports under file://, which is what a plain `<script type="module">`
setup would otherwise require.

Edit the real source in js/auth.js, js/data-ported.js, js/data-new.js,
js/app.js — then run:  python3 tools/build-bundle.py
Do not hand-edit js/app.bundle.js; it's generated output.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JS = ROOT / "js"

def strip_exports(src: str) -> str:
    return re.sub(r'^export\s+const\s+', 'const ', src, flags=re.M)

def main():
    data_ported = strip_exports((JS / "data-ported.js").read_text(encoding="utf-8"))
    data_new = strip_exports((JS / "data-new.js").read_text(encoding="utf-8"))
    auth = strip_exports((JS / "auth.js").read_text(encoding="utf-8"))
    app = (JS / "app.js").read_text(encoding="utf-8")
    app = re.sub(r'^import\s*\{[^}]*\}\s*from\s*"\./[^"]+";\s*\n', '', app, flags=re.M)

    bundle = f"""/* app.bundle.js — auto-generated single-file, non-module bundle of
   auth.js + data-ported.js + data-new.js + app.js, so the app runs by
   double-clicking index.html directly (file://) with no local server
   and no ES-module CORS restriction. Edit the source files in js/ and
   re-run tools/build-bundle.py — do not hand-edit this file. */
(function () {{
"use strict";

/* ---- auth.js ---- */
{auth}

/* ---- data-ported.js ---- */
{data_ported}

/* ---- data-new.js ---- */
{data_new}

/* ---- app.js ---- */
{app}
}})();
"""
    (JS / "app.bundle.js").write_text(bundle, encoding="utf-8")
    print(f"Wrote {JS / 'app.bundle.js'} ({len(bundle.splitlines())} lines)")

if __name__ == "__main__":
    main()
