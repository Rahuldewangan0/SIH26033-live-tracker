export default async function handler(req, res) {
  try {
    const response = await fetch("https://www.sih.gov.in/sih2026PS", {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html"
      }
    });

    if (!response.ok) {
      return res.status(502).json({
        error: "SIH portal returned HTTP " + response.status
      });
    }

    const html = await response.text();

    const psIndex = html.indexOf("SIH26033");

    if (psIndex === -1) {
      return res.status(404).json({
        error: "SIH26033 not found on SIH portal"
      });
    }

    const section = html.substring(
      Math.max(0, psIndex - 5000),
      Math.min(html.length, psIndex + 10000)
    );

    const match = section.match(
      /Submitted Idea\(s\) Count[\s\S]{0,300}?(\d{1,3})/i
    );

    if (!match) {
      return res.status(422).json({
        error: "Submission count not found",
        ps: "SIH26033"
      });
    }

    const count = Number(match[1]);

    return res.status(200).json({
      ps: "SIH26033",
      count: count,
      fetchedAt: new Date().toISOString(),
      source: "SIH public portal"
    });

  } catch (error) {
    return res.status(500).json({
      error: "Function failed",
      message: error.message
    });
  }
}
