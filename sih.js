export default async function handler(req, res) {
  const ps = String(req.query?.ps || "SIH26033").toUpperCase();
  if (ps !== "SIH26033") return res.status(400).json({error:"Unsupported problem statement"});

  try {
    const r = await fetch("https://www.sih.gov.in/sih2026PS", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SIH26033Tracker/1.0)",
        "Accept": "text/html,application/xhtml+xml"
      }
    });
    const html = await r.text();
    if (!r.ok) return res.status(502).json({error:"SIH portal returned "+r.status});

    const clean = html.replace(/\s+/g," ");
    const pos = clean.toUpperCase().indexOf(ps);
    if (pos < 0) return res.status(404).json({error:"Problem statement not found"});

    // Try several patterns because the public SIH page markup can change.
    const windows = [
      clean.slice(Math.max(0,pos-5000), Math.min(clean.length,pos+5000)),
      clean.slice(pos, Math.min(clean.length,pos+10000))
    ];
    const patterns = [
      /Submitted Idea\(s\) Count[^0-9]{0,120}(\d{1,3})/i,
      /Submitted Ideas?[^0-9]{0,120}(\d{1,3})/i,
      /submission(?:s)?[^0-9]{0,80}count[^0-9]{0,80}(\d{1,3})/i
    ];
    for (const w of windows) {
      for (const re of patterns) {
        const m = w.match(re);
        if (m) {
          const count = Number(m[1]);
          if (count >= 0 && count <= 500) {
            return res.status(200).json({ps, count, fetchedAt:new Date().toISOString(), source:"SIH public portal"});
          }
        }
      }
    }
    return res.status(422).json({error:"Could not locate the public submission count"});
  } catch (e) {
    return res.status(500).json({error:"Fetch failed"});
  }
}