export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: "Missing OPENAI_API_KEY on server" });

  try {
    const { lead, context } = req.body || {};

    const prompt = `
    You write natural LinkedIn DMs that sound like a real person (Ben) messaging a founder.

    What we offer:
    Bespoke “Founder Statement Pieces” — one-off portraits built entirely from thousands of individual screws. Industrial, bold, high-contrast. Designed for office walls, boardrooms, and milestone moments. Price range: £3k–£6k+ depending on size/complexity.

    CRITICAL POSITIONING:
    - Do NOT mention an artist or that you work with someone.
    - Speak as Ben who commissions/creates these pieces.
    - Avoid marketing language (“stunning”, “game-changer”, “exclusive”, “luxury”, “transform”, etc).
    - Don’t over-explain screws — one line max. Let curiosity do the work.

    LINKEDIN STYLE RULES (non-negotiable):
    - Must start with: "Hi {firstName}," OR "Hello {firstName},"
    - Must end with: "Cheers, Ben" OR "Thanks, Ben"
    - 2–4 short lines (LinkedIn scannable)
    - Friendly, human, a touch curious
    - No links
    - No emojis (unless the lead notes indicate they use them heavily)
    - One soft question at the end

    Offer framing (keep it subtle):
    - Founders typically commission these as (a) personal statement piece for their office, (b) brand statement for HQ, or (c) milestone/legacy marker.
    - Do not list prices unless they ask.

    Lead:
    ${JSON.stringify(lead || {}, null, 2)}

    Write 3 openers with different angles:
    1) Curiosity (what is it)
    2) Office/statement piece (where it goes)
    3) Milestone trigger (new office / award / growth / anniversary)

    Return JSON only:
    {
      "messages": [
        {"label": "Curiosity", "text": "..."},
        {"label": "Statement Piece", "text": "..."},
        {"label": "Milestone Trigger", "text": "..."}
      ]
    }
    `;


    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt,
        max_output_tokens: 500,
      }),
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data?.error?.message || "OpenAI error", raw: data });

    const text =
      data?.output_text ||
      data?.output?.map(o => o?.content?.map(c => c?.text).join("")).join("") ||
      "";

    // Clean markdown wrappers if model added them
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Try to extract JSON safely
    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // If JSON parse fails, attempt to extract messages manually
      const messageMatches = cleaned.match(/"text"\s*:\s*"([^"]+)"/g);

      if (messageMatches) {
        parsed = {
          messages: messageMatches.map((m, i) => ({
            label: `Option ${i + 1}`,
            text: m.replace(/"text"\s*:\s*"/, "").replace(/"$/, "")
          }))
        };
      } else {
        parsed = {
          messages: [
            { label: "Option 1", text: cleaned }
          ]
        };
      }
    }

    return res.status(200).json(parsed);

  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
