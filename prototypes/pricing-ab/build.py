import re,pathlib
d=pathlib.Path(__file__).parent
logo=(d/"bluehost-logo.svg").read_text()
logo=re.sub(r'\s(preserveAspectRatio|style|width|height)="[^"]*"','',logo.split('>',1)[0])+'>'+logo.split('>',1)[1]
logo=logo.replace('<svg','<svg role="img" aria-label="Bluehost"',1)
(d/"index.html").write_text((d/"src.html").read_text().replace("{{LOGO}}",logo.strip()))
# Also publish with the site build: Vite copies public/ into dist/, Netlify serves it at /pricing-ab/
pub=d.parent.parent/"public"/"pricing-ab"; pub.mkdir(parents=True,exist_ok=True)
(pub/"index.html").write_text((d/"index.html").read_text())
