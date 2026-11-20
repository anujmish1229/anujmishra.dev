"""Render the background name (images/name.png) as a 1-bit mask.

The dot field in js/dots.js samples this image, so visitors never download
the brush font. Re-run this only if the name or the typeface changes.

Usage:
    pip install pillow
    python scripts/render-name.py path/to/ZhiMangXing-Regular.ttf [text]

Zhi Mang Xing is free under the SIL Open Font License:
https://fonts.google.com/specimen/Zhi+Mang+Xing
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

font_path = sys.argv[1]
text = sys.argv[2] if len(sys.argv) > 2 else "米行远"
out = Path(__file__).resolve().parent.parent / "images" / "name.png"

size = 300
font = ImageFont.truetype(font_path, size)

# Stack the characters vertically, like a hanging scroll.
canvas = Image.new("L", (400, int(size * 1.02 * len(text)) + 40), 0)
draw = ImageDraw.Draw(canvas)
y = 10
for ch in text:
    left, top, right, _ = font.getbbox(ch)
    draw.text(((400 - (right - left)) // 2 - left, y - top), ch, font=font, fill=255)
    y += int(size * 1.02)

# Crop to the ink and make every pixel fully on or off.
mask = canvas.crop(canvas.getbbox()).point(lambda v: 255 if v > 110 else 0).convert("1")
mask.save(out, optimize=True)
print(f"wrote {out} ({mask.width}x{mask.height})")
