import sys, os
sys.path.insert(0, r"C:/Users/caiov/AppData/Local/Temp/claude/c--Users-caiov-dev-cw-case/366a7e43-289f-41c9-b039-1d3ae2f418f7/scratchpad/pylibs")
from fontTools import subset
from PIL import Image

ROOT = r"c:/Users/caiov/dev/cw-case"
OUT  = os.path.join(ROOT, "deck", "assets")

chars = (
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    "areaocdefghijklmnopqrstuvwxyz"
    "\u00e1\u00e0\u00e2\u00e3\u00e4\u00e9\u00e8\u00ea\u00eb\u00ed\u00ec\u00ee\u00ef"
    "\u00f3\u00f2\u00f4\u00f5\u00f6\u00fa\u00f9\u00fb\u00fc\u00e7\u00f1"
    "\u00c1\u00c0\u00c2\u00c3\u00c4\u00c9\u00c8\u00ca\u00cb\u00cd\u00cc\u00ce\u00cf"
    "\u00d3\u00d2\u00d4\u00d5\u00d6\u00da\u00d9\u00db\u00dc\u00c7\u00d1"
    " .,;:!?'\"()[]{}%$#@&*+-=/|<>_^~`\\"
    "\u00b7\u2014\u2013\u2026\u00b0\u00ba\u00aa\u2192\u2190\u2191\u2193\u00d7\u00f7"
    "\u2265\u2264\u2248\u2022\u00ab\u00bb\u201c\u201d\u2018\u2019\u2011"
)
unicodes = ",".join("U+%04X" % ord(c) for c in sorted(set(chars)))

for name in ("Regular", "Medium", "Bold"):
    subset.main([
        os.path.join(ROOT, "web/public/fonts", f"CeraPro-{name}.woff2"),
        f"--unicodes={unicodes}", "--flavor=woff2",
        "--layout-features=kern,liga",
        f"--output-file={os.path.join(OUT, f'CeraPro-{name}.woff2')}",
    ])
    print(f"font {name}: {os.path.getsize(os.path.join(OUT, f'CeraPro-{name}.woff2'))} bytes")

for src, dst in (("logo-horizontal-black.png", "logo-black.png"),
                 ("logo-horizontal-white.png", "logo-white.png")):
    img = Image.open(os.path.join(ROOT, "web/public/brand", src))
    w = 520
    img = img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)
    path = os.path.join(OUT, dst)
    img.save(path, "PNG", optimize=True)
    print(f"{dst}: {img.size} {os.path.getsize(path)} bytes")
