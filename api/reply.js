export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: "Missing OPENAI_API_KEY on server" });

  try {
    const { lead, theirReply, yourLastMessage } = req.body || {};

    const prompt = `
    You are Ben. You are replying on LinkedIn to founders about bespoke “Founder Statement Pieces”.
    They are one-off portraits built from thousands of individual screws (industrial, bold, high-contrast).
    Typical value £3k–£6k+ depending on size/complexity.

    GOAL:
    Get the next step: permission to show examples + identify which of the 3 piece types fits them.

    3 PIECE TYPES (internal framing):
    1) Signature Founder Portrait (£3k–£4k)
    2) Founder + Brand Statement (£4k–£5k)
    3) Milestone / Legacy Edition (£5k–£6k+)
    Do NOT dump the full list unless they’re engaged. Use it as structure.

    LINKEDIN STYLE RULES (non-negotiable):
    - Start with "Hi {firstName}," or "Hello {firstName},"
    - End with "Cheers, Ben" or "Thanks, Ben"
    - 2–5 short lines
    - Natural, not salesy
    - No links
    - No emojis
    - One soft question

    WHEN TO MENTION PRICE:
    - Only if they ask about price/budget, or they ask “how much”.

    WHAT TO DO NEXT:
    - If curious: ask permission to share 2–3 examples and ask which direction fits (office statement / brand / milestone).
    - If asks examples: offer to send 2–3 and ask what vibe (serious/modern) and where it would hang (office/reception/home office).
    - If asks price: give range calmly with “depends on size/detail”, then offer examples.
    - If cold: polite exit + keep door open.

    Inputs:
    Lead:
    ${JSON.stringify(lead || {}, null, 2)}

    Their reply:
    "${theirReply || ""}"

    Return JSON only:
    {
      "temperature": "warm|neutral|cold",
      "intent": "curious|examples|price|timing|not_interested|other",
      "best_reply": "...",
      "follow_up_if_no_reply_3_days": "..."
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
