export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: "Missing OPENAI_API_KEY on server" });

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
Return JSON exactly: { "messages": ["...", "...", "..."] }
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
