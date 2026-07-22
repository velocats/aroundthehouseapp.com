#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps
import argparse

WIDTH, HEIGHT = 2064, 2752
INK = "#183A33"
MUTED = "#596B64"
FONT = "/System/Library/Fonts/SFNS.ttf"
FONT_ROUNDED = "/System/Library/Fonts/SFNSRounded.ttf"

SCREENS = [
    ("Simulator Screenshot - iPad Air 13-inch (M3) - 2026-07-19 at 13.54.39.png", "01-remember-what-needs-attention.png", "Remember What\nNeeds Attention", "See overdue work, upcoming maintenance, and important home details in one place."),
    ("Simulator Screenshot - iPad Air 13-inch (M3) - 2026-07-19 at 13.54.49.png", "02-organize-every-home-item.png", "Organize Every Item\nIn Your Home", "Keep photos, service dates, documents, and reminders attached to the right item."),
    ("Simulator Screenshot - iPad Air 13-inch (M3) - 2026-07-19 at 13.55.01.png", "03-stay-ahead-of-maintenance.png", "Stay Ahead of\nHome Maintenance", "Plan recurring work and see what is due today, upcoming, or overdue."),
    ("Simulator Screenshot - iPad Air 13-inch (M3) - 2026-07-19 at 13.55.17.png", "04-keep-home-documents-together.png", "Keep Home Documents\nTogether", "Organize receipts, manuals, and warranties by category and home item."),
    ("Simulator Screenshot - iPad Air 13-inch (M3) - 2026-07-19 at 13.55.32.png", "05-see-your-homes-health.png", "See Your Home’s\nHealth", "Turn maintenance history into a clear score, watchlist, and practical next steps."),
    ("Simulator Screenshot - iPad Air 13-inch (M3) - 2026-07-19 at 13.55.51.png", "06-understand-home-costs.png", "Understand What\nYour Home Costs", "Track maintenance, repairs, replacements, asset value, and future exposure."),
    ("Simulator Screenshot - iPad Air 13-inch (M3) - 2026-07-19 at 13.56.10.png", "07-watch-warranty-deadlines.png", "Watch Every\nWarranty Deadline", "See expired coverage and upcoming warranty dates across your home equipment."),
    ("Simulator Screenshot - iPad Air 13-inch (M3) - 2026-07-19 at 13.56.22.png", "08-create-a-home-handoff.png", "Create a Better\nHome Handoff", "Prepare a useful record of assets, maintenance, reminders, documents, and warranties."),
]


def font(size, rounded=False):
    return ImageFont.truetype(FONT_ROUNDED if rounded else FONT, size=size)


def rounded_mask(size, radius):
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=255)
    return mask


def wrap(draw, text, selected_font, max_width):
    words = text.split()
    lines, current = [], []
    for word in words:
        trial = " ".join(current + [word])
        if draw.textbbox((0, 0), trial, font=selected_font)[2] <= max_width:
            current.append(word)
        else:
            lines.append(" ".join(current))
            current = [word]
    if current:
        lines.append(" ".join(current))
    return "\n".join(lines)


def build(background_path, icon_path, source_path, output_path, headline, subtitle):
    background = Image.open(background_path).convert("RGB")
    background = ImageOps.fit(background, (WIDTH, HEIGHT), method=Image.Resampling.LANCZOS)
    canvas = background.copy()
    draw = ImageDraw.Draw(canvas)

    icon = Image.open(icon_path).convert("RGBA")
    icon = ImageOps.fit(icon, (90, 90), method=Image.Resampling.LANCZOS)
    icon.putalpha(rounded_mask(icon.size, 20))
    brand_font = font(39, rounded=True)
    brand = "Around The House"
    brand_width = draw.textbbox((0, 0), brand, font=brand_font)[2]
    group_width = 90 + 24 + brand_width
    group_x = int((WIDTH - group_width) / 2)
    canvas.paste(icon, (group_x, 72), icon)
    draw.text((group_x + 114, 94), brand, font=brand_font, fill=INK)

    headline_font = font(88, rounded=True)
    headline_box = draw.multiline_textbbox((0, 0), headline, font=headline_font, spacing=6, align="center")
    headline_width = headline_box[2] - headline_box[0]
    draw.multiline_text(((WIDTH - headline_width) / 2, 220), headline, font=headline_font, fill=INK, spacing=6, align="center")

    subtitle_font = font(40)
    subtitle_text = wrap(draw, subtitle, subtitle_font, 1710)
    subtitle_box = draw.multiline_textbbox((0, 0), subtitle_text, font=subtitle_font, spacing=10, align="center")
    subtitle_width = subtitle_box[2] - subtitle_box[0]
    draw.multiline_text(((WIDTH - subtitle_width) / 2, 440), subtitle_text, font=subtitle_font, fill=MUTED, spacing=10, align="center")

    source = Image.open(source_path).convert("RGB")
    inner_w = 1690
    inner_h = round(inner_w * source.height / source.width)
    source = source.resize((inner_w, inner_h), Image.Resampling.LANCZOS)
    source_mask = rounded_mask(source.size, 55)

    frame_w = inner_w + 74
    frame_h = inner_h + 74
    frame_x = (WIDTH - frame_w) // 2
    frame_y = 690
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle((frame_x + 12, frame_y + 28, frame_x + frame_w + 12, frame_y + frame_h + 28), radius=76, fill=(24, 47, 42, 76))
    shadow = shadow.filter(ImageFilter.GaussianBlur(38))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), shadow)

    frame = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    frame_draw = ImageDraw.Draw(frame)
    frame_draw.rounded_rectangle((frame_x, frame_y, frame_x + frame_w, frame_y + frame_h), radius=78, fill="#101312")
    canvas = Image.alpha_composite(canvas, frame)
    canvas.paste(source, (frame_x + 37, frame_y + 37), source_mask)

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
