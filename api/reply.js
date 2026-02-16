export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: "Missing OPENAI_API_KEY on server" });

  try {
    const { lead, theirReply, yourLastMessage } = req.body || {};

    const prompt = `
You are a high-ticket closer selling bespoke screw-art portrait commissions (£3k–£6k).
Classify the reply and draft the best next message.

Lead:
${JSON.stringify(lead || {}, null, 2)}

Your last message:
${yourLastMessage || ""}

Their reply:
${theirReply || ""}

Return JSON exactly:
{
  "temperature": "warm" | "cold" | "neutral",
  "intent": "curious" | "price" | "examples" | "timing" | "not_interested" | "other",
  "best_reply": "string",
  "follow_up_if_no_reply_3_days": "string"
}

Rules:
- Keep best_reply under 90 words
- No pressure, premium tone
- If they ask price: give a range (£3k–£6k) and offer to show examples + ask photo/size
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
        max_output_tokens: 600,
      }),
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data?.error?.message || "OpenAI error", raw: data });

    const text =
      data?.output_text ||
      data?.output?.map(o => o?.content?.map(c => c?.text).join("")).join("") ||
      "";

    let parsed;
    try { parsed = JSON.parse(text); }
    catch {
      parsed = { temperature: "neutral", intent: "other", best_reply: text, follow_up_if_no_reply_3_days: "" };
    }

    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
