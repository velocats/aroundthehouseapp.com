#!/usr/bin/env python3
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public/assets/og/around-the-house-og-v2.png"
ICON = ROOT / "public/assets/icons/around-the-house-icon.png"
SCREENSHOT = ROOT / "public/assets/screenshots/new/iphone-today.webp"

WIDTH, HEIGHT = 1200, 630
INK = "#183A33"
MUTED = "#52645E"
BACKGROUND = "#F4F0E8"
FONT = "/System/Library/Fonts/SFNS.ttf"
FONT_ROUNDED = "/System/Library/Fonts/SFNSRounded.ttf"


def font(size: int, rounded: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_ROUNDED if rounded else FONT, size=size)


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=255
    )
    return mask


def build() -> None:
    canvas = Image.new("RGB", (WIDTH, HEIGHT), BACKGROUND)
    draw = ImageDraw.Draw(canvas)

    draw.ellipse((-150, -180, 430, 400), fill="#D6E9DF")
    draw.ellipse((490, -310, 1120, 250), fill="#E2ECE5")
    draw.ellipse((950, 335, 1350, 790), fill="#EADDC3")

    icon = Image.open(ICON).convert("RGBA")
    icon = ImageOps.fit(icon, (118, 118), method=Image.Resampling.LANCZOS)
    icon.putalpha(rounded_mask(icon.size, 24))
    canvas.paste(icon, (72, 84), icon)

    draw.text((72, 224), "Around The House", font=font(67, rounded=True), fill=INK)
    draw.multiline_text(
        (76, 315),
        "Your home has a lot to remember.\nNow it doesn’t all have to live in your head.",
        font=font(29),
        fill=MUTED,
        spacing=10,
    )
    draw.text(
        (76, 442),
        "Repairs  ·  Reminders  ·  Warranties  ·  Receipts",
        font=font(20, rounded=True),
        fill=INK,
    )
    draw.text(
        (76, 493),
        "Private home records for iPhone, iPad, and Mac.",
        font=font(23),
        fill=MUTED,
    )

    screenshot = Image.open(SCREENSHOT).convert("RGB")
    screen_height = 520
    screen_width = round(screen_height * screenshot.width / screenshot.height)
    screenshot = screenshot.resize((screen_width, screen_height), Image.Resampling.LANCZOS)

    frame_padding = 13
    frame_size = (screen_width + frame_padding * 2, screen_height + frame_padding * 2)
    frame_x = 865
    frame_y = 47

    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle(
        (frame_x + 8, frame_y + 12, frame_x + frame_size[0] + 8, frame_y + frame_size[1] + 12),
        radius=39,
        fill=(24, 58, 51, 70),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(16))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), shadow)

    frame = Image.new("RGBA", frame_size, "#111514")
    frame.putalpha(rounded_mask(frame_size, 36))
    canvas.paste(frame, (frame_x, frame_y), frame)

    screen_mask = rounded_mask(screenshot.size, 27)
    canvas.paste(
        screenshot,
        (frame_x + frame_padding, frame_y + frame_padding),
        screen_mask,
    )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(OUTPUT, "PNG", optimize=True)
    print(OUTPUT)


if __name__ == "__main__":
    build()
