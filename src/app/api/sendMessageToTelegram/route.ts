// ✅ CORS (якщо треба)
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// ✅ POST handler
export async function POST(req: Request) {
  let body: any = {};

  try {
    body = await req.json();
  } catch (e) {
    console.error("JSON parse error:", e);
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, phone, quizResaults } = body;

  // ❗ обов'язкова перевірка
  if (!phone) {
    return Response.json({ error: "Phone is required" }, { status: 400 });
  }

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return Response.json({ error: "Server config error" }, { status: 500 });
  }

  const URI_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  // 🔥 будуємо повідомлення
  let message = `<b>Нова заявка з сайту</b>\n\n`;

  if (name) {
    message += `👤 Ім'я: ${name}\n`;
  }

  message += `📞 Телефон: +380${phone}\n`;

  // ✅ КВІЗ (опціонально)
  if (quizResaults) {
    message += `\n<b>📋 Дані з квізу:</b>\n`;

    if (quizResaults.type) {
      message += `📌 Тип: ${quizResaults.type}\n`;
    }

    if (quizResaults.fasad) {
      message += `🏠 Фасад: ${quizResaults.fasad}\n`;
    }

    if (quizResaults.stilnc) {
      message += `🎨 Стиль: ${quizResaults.stilnc}\n`;
    }

    if (quizResaults.area) {
      message += `📐 Площа: ${quizResaults.area}\n`;
    }

    if (quizResaults.time) {
      message += `⏳ Термін: ${quizResaults.time}\n`;
    }
  }

  try {
    const tgRes = await fetch(URI_API, {
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

    const tgData = await tgRes.json();

    if (!tgData.ok) {
      console.error("Telegram error:", tgData);
      return Response.json({ error: "Telegram failed" }, { status: 500 });
    }

    return Response.json(
      { ok: true },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (error) {
    console.error("Fetch error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
