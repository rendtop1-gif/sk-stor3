export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { cart, total } = req.body;

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  let text = "🛒 НОВЫЙ ЗАКАЗ\n\n";

  cart.forEach(i => {
    text += `• ${i.name} x${i.qty} = ${i.price * i.qty}₽\n`;
  });

  text += `\n💰 ИТОГО: ${total}₽`;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text
    })
  });

  return res.status(200).json({ ok: true });
}