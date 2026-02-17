export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: "Missing OPENAI_API_KEY on server" });

  try {
    const { lead } = req.body || {};
    if (!lead) return res.status(400).json({ error: "Missing lead" });

    const prompt = `
    You are writing a polite LinkedIn follow-up to someone who hasn’t replied.

    Context:
    You commission bespoke screw-built portrait pieces for founders as milestone/legacy artwork.

    Tone:
    Friendly, calm, human — not salesy.

    STYLE RULES:
    - Start with "Hi [FirstName]," or "Hello [FirstName],"
    - End with "Cheers, Ben" or "Thanks, Ben"
    - Short and natural
    - No pressure
    - No price mention

    Lead:
    ${JSON.stringify(lead, null, 2)}

    Goal:
    Gently restart the conversation with curiosity.

    Return JSON:
    { "text": "..." }
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
        max_output_tokens: 250,
      }),
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data?.error?.message || "OpenAI error", raw: data });

    const text =
      data?.output_text ||
      data?.output?.map(o => o?.content?.map(c => c?.text).join("")).join("") ||
      "";

    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = { text: text.trim() }; }

    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
