export async function POST(req: Request) {
  const { name, phone } = await req.json();

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  const URI_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  let message = `<b>Нова заявка з сайту</b>\n\n`;

  if (name) {
    message += `👤 Ім'я: ${name}\n`;
  }

  message += `📞 Телефон: +380${phone}`;

  await fetch(URI_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      parse_mode: "html",
      text: message,
    }),
  });

  return Response.json({ ok: true });
}
