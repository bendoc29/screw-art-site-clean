export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: "Missing OPENAI_API_KEY on server" });

  try {
    const { lead, theirReply, yourLastMessage } = req.body || {};

    const prompt = `
    You are replying naturally on LinkedIn about bespoke £3k–£6k screw-built portrait commissions.

    Tone:
    Friendly, human, professional — never salesy.

    Positioning:
    You initially present these as commissioned bespoke pieces.
    Only introduce the artist later if useful or asked.

    Lead:
    ${JSON.stringify(lead || {}, null, 2)}

    Your last message:
    ${yourLastMessage || ""}

    Their reply:
    ${theirReply || ""}

    Tasks:

    1) Classify temperature: warm, neutral, or cold  
    2) Identify intent: curious, price, examples, timing, not_interested, other  

    3) Write the best next LinkedIn message.

    STYLE RULES:
    - Start with "Hi [FirstName]," or "Hello [FirstName],"
    - End with "Cheers, Ben" or "Thanks, Ben"
    - Short, natural paragraphs
    - No pressure

    CONTENT RULES:
    - If price asked → explain custom range (£3k–£6k) calmly
    - If curious → guide toward examples
    - If hesitant → stay light and friendly

    Also write:
    - A soft 3-day follow-up message

    Return JSON only:
    {
      "temperature": "...",
      "intent": "...",
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
