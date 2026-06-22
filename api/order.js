export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { cart, total } = req.body;

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: "No env vars" });
  }

  let text = "🛒 НОВЫЙ ЗАКАЗ\n\n";

  cart.forEach(item => {
    text += `• ${item.name} x${item.qty} = ${item.price * item.qty}₽\n`;
  });

  text += `\n💰 ИТОГО: ${total}₽`;

  const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  const tgRes = await fetch(telegramUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text
    })
  });

  if (tgRes.ok) {
    return res.status(200).json({ ok: true });
  }

  return res.status(500).json({ error: "Telegram failed" });
}