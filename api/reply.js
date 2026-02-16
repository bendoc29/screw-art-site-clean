export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: "Missing ANTHROPIC_API_KEY on server" });

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

Return JSON:
{
  "temperature": "warm" | "cold" | "neutral",
  "intent": "curious" | "price" | "examples" | "timing" | "not_interested" | "other",
  "best_reply": "string",
  "follow_up_if_no_reply_3_days": "string"
}

Rules:
- Keep best_reply under 90 words
- No pressure, premium tone
- If they ask price: suggest a range and offer to show examples + get photo/size
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
        max_tokens: 450,
        temperature: 0.4,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data?.error?.message || "Anthropic error", raw: data });

    const text = data?.content?.[0]?.text || "";
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
