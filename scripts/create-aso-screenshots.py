#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps
import argparse

WIDTH, HEIGHT = 1242, 2688
INK = "#183A33"
MUTED = "#596B64"
FONT = "/System/Library/Fonts/SFNS.ttf"
FONT_ROUNDED = "/System/Library/Fonts/SFNSRounded.ttf"

SCREENS = [
    ("Simulator Screenshot - iPhone 17 - 2026-07-19 at 12.42.05.png", "01-remember-what-needs-attention.png", "Remember What Needs\nAttention", "See overdue work, upcoming maintenance, and important home details in one place."),
    ("Simulator Screenshot - iPhone 17 - 2026-07-19 at 13.10.10.png", "02-organize-every-home-item.png", "Organize Every Item\nIn Your Home", "Keep photos, service dates, documents, and reminders attached to the right item."),
    ("Simulator Screenshot - iPhone 17 - 2026-07-19 at 13.10.21.png", "03-stay-ahead-of-maintenance.png", "Stay Ahead of\nHome Maintenance", "Plan recurring work and see what is due today, upcoming, or overdue."),
    ("Simulator Screenshot - iPhone 17 - 2026-07-19 at 13.10.35.png", "04-keep-home-documents-together.png", "Keep Home Documents\nTogether", "Organize receipts, manuals, and warranties by category and home item."),
    ("Simulator Screenshot - iPhone 17 - 2026-07-19 at 13.40.33.png", "05-see-your-homes-health.png", "See Your Home’s\nHealth", "Turn maintenance history into a clear score, watchlist, and practical next steps."),
    ("Simulator Screenshot - iPhone 17 - 2026-07-19 at 13.40.59.png", "06-understand-home-costs.png", "Understand What Your\nHome Costs", "Track maintenance, repairs, replacements, asset value, and future exposure."),
    ("Simulator Screenshot - iPhone 17 - 2026-07-19 at 13.41.07.png", "07-watch-warranty-deadlines.png", "Watch Every Warranty\nDeadline", "See expired coverage and upcoming warranty dates across your home equipment."),
    ("Simulator Screenshot - iPhone 17 - 2026-07-19 at 13.41.21.png", "08-create-a-home-handoff.png", "Create a Better\nHome Handoff", "Prepare a useful record of assets, maintenance, reminders, documents, and warranties."),
]


def font(size, rounded=False):
    return ImageFont.truetype(FONT_ROUNDED if rounded else FONT, size=size)


def rounded_mask(size, radius):
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=255)
    return mask


def center_multiline(draw, text, y, selected_font, fill, spacing=10):
    box = draw.multiline_textbbox((0, 0), text, font=selected_font, spacing=spacing, align="center")
    text_width = box[2] - box[0]
    draw.multiline_text(((WIDTH - text_width) / 2, y), text, font=selected_font, fill=fill, spacing=spacing, align="center")


def fit_subtitle(draw, text, y):
    selected_font = font(31)
    words = text.split()
    lines, current = [], []
    max_width = 1030
    for word in words:
        trial = " ".join(current + [word])
        if draw.textbbox((0, 0), trial, font=selected_font)[2] <= max_width:
            current.append(word)
        else:
            lines.append(" ".join(current))
            current = [word]
    if current:
        lines.append(" ".join(current))
    center_multiline(draw, "\n".join(lines), y, selected_font, MUTED, spacing=8)


def build(background_path, icon_path, source_path, output_path, headline, subtitle):
    background = Image.open(background_path).convert("RGB")
    background = ImageOps.fit(background, (WIDTH, HEIGHT), method=Image.Resampling.LANCZOS)
    canvas = background.copy()
    draw = ImageDraw.Draw(canvas)

    icon = Image.open(icon_path).convert("RGBA")
    icon = ImageOps.fit(icon, (70, 70), method=Image.Resampling.LANCZOS)
    icon_mask = rounded_mask(icon.size, 15)
    icon.putalpha(icon_mask)
    brand_font = font(29, rounded=True)
    brand = "Around The House"
    brand_width = draw.textbbox((0, 0), brand, font=brand_font)[2]
    group_width = 70 + 18 + brand_width
    group_x = int((WIDTH - group_width) / 2)
    canvas.paste(icon, (group_x, 65), icon)
    draw.text((group_x + 88, 83), brand, font=brand_font, fill=INK)

    center_multiline(draw, headline, 185, font(59, rounded=True), INK, spacing=5)
    fit_subtitle(draw, subtitle, 340)

    source = Image.open(source_path).convert("RGB")
    inner_w = 922
    inner_h = round(inner_w * source.height / source.width)
    source = source.resize((inner_w, inner_h), Image.Resampling.LANCZOS)
    inner_mask = rounded_mask(source.size, 92)

    frame_x = (WIDTH - 992) // 2
    frame_y = 665
    frame_w = 992
    frame_h = inner_h + 76

    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle((frame_x + 8, frame_y + 24, frame_x + frame_w - 8, frame_y + frame_h + 24), radius=120, fill=(24, 47, 42, 80))
    shadow = shadow.filter(ImageFilter.GaussianBlur(34))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), shadow)

    frame = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    frame_draw = ImageDraw.Draw(frame)
    frame_draw.rounded_rectangle((frame_x, frame_y, frame_x + frame_w, frame_y + frame_h), radius=118, fill="#101312")
    canvas = Image.alpha_composite(canvas, frame)
    canvas.paste(source, (frame_x + 35, frame_y + 37), inner_mask)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(output_path, "PNG", optimize=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--background", required=True, type=Path)
    parser.add_argument("--source-dir", required=True, type=Path)
    parser.add_argument("--icon", required=True, type=Path)
    args = parser.parse_args()

    for source_name, output_name, headline, subtitle in SCREENS:
        build(args.background, args.icon, args.source_dir / source_name, args.source_dir / output_name, headline, subtitle)
        print(args.source_dir / output_name)


if __name__ == "__main__":
    main()
