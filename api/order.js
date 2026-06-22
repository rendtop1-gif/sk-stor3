export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { cart, total, nick, tg, email, comment, orderId } = req.body;

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  let text = `🛒 НОВЫЙ ЗАКАЗ #${orderId}\n\n`;

text += `🎮 Ник: ${nick || "-"}\n`;
text += `💬 Telegram: ${tg || "-"}\n`;
text += `📧 Почта: ${email || "-"}\n`;
text += `📝 Комментарий: ${comment || "-"}\n\n`;

text += `📦 ТОВАРЫ:\n`;

cart.forEach(i => {
  text += `• ${i.name} ×${i.qty} = ${i.price * i.qty}₽\n`;
});

text += `\n💰 ИТОГО: ${total}₽`;

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  const tgRes = await fetch(url, {
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