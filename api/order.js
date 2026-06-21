export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { cart, total } = req.body;

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    let text = "🛒 НОВЫЙ ЗАКАЗ\n\n";

    cart.forEach(item => {
      text += `• ${item.name} x${item.qty} — ${item.price * item.qty} ₽\n`;
    });

    text += `\n💰 ИТОГО: ${total} ₽`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text
      })
    });

    const data = await response.json();

    return res.status(200).json({ ok: true, data });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}