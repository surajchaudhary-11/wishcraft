import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
req = urllib.request.Request('https://wishcraft-chi.vercel.app/', headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
print("HTML length:", len(html))
print(html[:500])

scripts = re.findall(r'src="(/assets/[^"]+)"', html)
print("Scripts found:", scripts)

for script in scripts:
    script_url = f"https://wishcraft-chi.vercel.app{script}"
    s_req = urllib.request.Request(script_url, headers={'User-Agent': 'Mozilla/5.0'})
    js_content = urllib.request.urlopen(s_req, context=ctx).read().decode('utf-8')
    print(f"\nScript {script} size: {len(js_content)} chars")
    
    # Check what API URL is baked into the frontend!
    api_matches = re.findall(r'https?://[^\s"\'`)]+api[^\s"\'`)]*', js_content)
    print("API URL matches in JS:", set(api_matches))

    onrender_matches = re.findall(r'https?://[^\s"\'`)]*onrender[^\s"\'`)]*', js_content)
    print("Render URL matches in JS:", set(onrender_matches))

    localhost_matches = re.findall(r'http://localhost:[0-9]+[^\s"\'`)]*', js_content)
    print("Localhost matches in JS:", set(localhost_matches))
