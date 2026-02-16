export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: "Missing ANTHROPIC_API_KEY on server" });

  try {
    const { lead, context } = req.body || {};

    const prompt = `
You are a premium outbound copywriter selling £3k–£6k bespoke screw-art portrait commissions.
Write 3 short LinkedIn DMs (curiosity-first, NOT salesy) tailored to this lead.

Lead:
${JSON.stringify(lead || {}, null, 2)}

Context / trigger:
${context || "None"}

Rules:
- 40–70 words max each
- No pricing mention
- One question at the end
- Sound human, UK/Ireland tone
Return JSON: { "messages": ["...", "...", "..."] }
`;

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-latest",
        max_tokens: 400,
        temperature: 0.7,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data?.error?.message || "Anthropic error", raw: data });

    const text = data?.content?.[0]?.text || "";
    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = { messages: [text] }; }

    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
