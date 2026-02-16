export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: "Missing OPENAI_API_KEY on server" });

  try {
    const { lead, context } = req.body || {};

    const prompt = `
You are crafting premium outreach messages for bespoke £3,000–£6,000 screw-built portrait commissions.

What is being sold:
One-off handcrafted portrait pieces built entirely from thousands of individual screws — typically commissioned by founders, CEOs, and business owners to mark milestones, achievements, or personal legacy moments.

IMPORTANT POSITIONING:
- Do NOT mention an artist or that you work with anyone.
- Position it as: “I’ve been creating/commissioning bespoke portrait pieces…”
- Reveal the artist only later after interest is shown.
- Tone: sharp, confident, intriguing — never salesy.

Lead details:
${JSON.stringify(lead || {}, null, 2)}

Extra context:
${context || "None"}

Write 3 LinkedIn DM openers:

Rules:
- 35–75 words
- Hook-first (no generic compliments)
- Curiosity-driven
- No pricing
- No hard sell
- End with a soft question
- Tailored to founder/owner psychology
- Sound human and premium

Return JSON only:
{
  "messages": [
    {"label": "Curiosity", "text": "..."},
    {"label": "Milestone", "text": "..."},
    {"label": "Legacy", "text": "..."}
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

    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = { messages: [text] }; }

    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
