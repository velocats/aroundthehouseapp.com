#!/usr/bin/env python3
"""Reproduce Phase 2 composites from approved inputs. Requires Pillow and NumPy.
No UI is generated or retouched. The complete captures are fitted proportionally
into screen apertures, perspective mapped and masked beneath original bezels.
"""
from pathlib import Path
from io import BytesIO
import hashlib
import json
import zipfile
import numpy as np
from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / 'docs/design-reference/website images-20261011T222919Z-1-001.zip'
OUTPUT = ROOT / 'public/assets/home-story'
PROOFS = ROOT / 'docs/design/phase2/composites'
SCENES = [
    dict(id='filter', photo='website images/airfilter.jpeg', capture='furnace-filter.png',
         quad=[(1123,288),(1358,288),(1358,772),(1123,772)], radius=31,
         crop=(880,0,1635,944)),
    dict(id='smoke', photo='website images/AaEs3BYGNuYswCyvfw5kYg-AaEs3BYG5DelzTn1_CtDmQ.jpg', capture='smoke-alarm.png',
         quad=[(1132,338),(1346,335),(1353,800),(1137,801)], radius=26,
         crop=(660,0,1415,944)),
    dict(id='heater', photo='website images/AaEssReI4e7mQ2pZx2mxHQ-AaEssReIEWjDJzknMPkx5Q.jpg', capture='water-heater.png',
         quad=[(1014,165),(1286,165),(1285,753),(1014,753)], radius=33,
         crop=(575,0,1330,944), notch=True),
]

def inverse_coefficients(quad, width, height):
    # Pillow uses destination -> source projective coordinates.
    target=[(0,0),(width,0),(width,height),(0,height)]
    rows=[]; values=[]
    for (x,y),(u,v) in zip(quad,target):
        rows.extend([[x,y,1,0,0,0,-u*x,-u*y],[0,0,0,x,y,1,-v*x,-v*y]])
        values.extend([u,v])
    return tuple(np.linalg.solve(np.array(rows),np.array(values)))

OUTPUT.mkdir(parents=True,exist_ok=True); PROOFS.mkdir(parents=True,exist_ok=True)
manifest=[]
with zipfile.ZipFile(ARCHIVE) as archive:
    for scene in SCENES:
        original_bytes=archive.read(scene['photo'])
        photo=Image.open(BytesIO(original_bytes)).convert('RGB')
        capture_path=ROOT/'docs/design-reference/iphone-screenshots'/scene['capture']
        capture_bytes=capture_path.read_bytes()
        shot=Image.open(BytesIO(capture_bytes)).convert('RGB')
        quad=scene['quad']
        w=round((np.linalg.norm(np.array(quad[1])-quad[0])+np.linalg.norm(np.array(quad[2])-quad[3]))/2)
        h=round((np.linalg.norm(np.array(quad[3])-quad[0])+np.linalg.norm(np.array(quad[2])-quad[1]))/2)
        # Oversampled fit/mask avoids jagged corners. Letterbox instead of stretching/cropping UI.
        scale=4; plane=Image.new('RGB',(w*scale,h*scale),shot.getpixel((0,0)))
        fitted=ImageOps.contain(shot,plane.size,Image.Resampling.LANCZOS)
        plane.paste(fitted,((plane.width-fitted.width)//2,(plane.height-fitted.height)//2))
        alpha=Image.new('L',plane.size); draw=ImageDraw.Draw(alpha)
        draw.rounded_rectangle((0,0,plane.width-1,plane.height-1),radius=scene['radius']*scale,fill=255)
        coeff=inverse_coefficients(quad,plane.width,plane.height)
        warped=plane.transform(photo.size,Image.Transform.PERSPECTIVE,coeff,Image.Resampling.BICUBIC)
        mask=alpha.transform(photo.size,Image.Transform.PERSPECTIVE,coeff,Image.Resampling.BICUBIC)
        if scene.get('notch'):
            # Preserve the original physical camera notch, not a recreated interface element.
            keep=Image.new('L',photo.size,255); d=ImageDraw.Draw(keep)
            d.polygon([(1100,164),(1204,164),(1200,181),(1195,187),(1111,187),(1105,181)],fill=0)
            mask=Image.fromarray(np.minimum(np.array(mask),np.array(keep)))
        composite=Image.composite(warped,photo,mask)
        composite.save(PROOFS/f'{scene["id"]}-master.png')
        mobile=composite.crop(scene['crop'])
        files=[]
        for label,base,widths in [('desktop',composite,[768,1200,1680]),('mobile',mobile,[480,755])]:
            for width in widths:
                height=round(base.height*width/base.width)
                asset=base.resize((width,height),Image.Resampling.LANCZOS)
                for fmt,options in [('webp',dict(quality=87,method=6)),('avif',dict(quality=82,speed=6))]:
                    filename=f'{scene["id"]}-{label}-{width}.{fmt}'
                    asset.save(OUTPUT/filename,**options)
                    files.append(dict(file=filename,width=width,height=height,bytes=(OUTPUT/filename).stat().st_size))
            filename=f'{scene["id"]}-{label}.jpg'
            base.save(OUTPUT/filename,quality=91,optimize=True)
            files.append(dict(file=filename,width=base.width,height=base.height,bytes=(OUTPUT/filename).stat().st_size))
        # Supplemental full captures, without masking, crop, warping or pixel retouch.
        shot.resize((660,1434),Image.Resampling.LANCZOS).save(OUTPUT/f'{scene["id"]}-capture.webp',quality=93,method=6)
        manifest.append(dict(scene=scene['id'],archive=str(ARCHIVE.relative_to(ROOT)),photo=scene['photo'],
            photo_sha256=hashlib.sha256(original_bytes).hexdigest(),photo_size=list(photo.size),
            screenshot=str(capture_path.relative_to(ROOT)),screenshot_sha256=hashlib.sha256(capture_bytes).hexdigest(),
            screenshot_size=list(shot.size),screen_quad=quad,corner_radius=scene['radius'],mobile_crop=scene['crop'],
            fit='Full screenshot, proportional contain; aperture edge padding only',files=files))
(PROOFS/'asset-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Created 3 composites, 42 responsive assets and 3 supplemental captures.')
