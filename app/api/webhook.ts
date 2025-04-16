import { NextApiRequest, NextApiResponse } from "next";
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.command("start", (ctx) => {
  ctx.reply("Welcome!", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Открыть форму",
            web_app: {
              url: "https://vercel.com/anderbois-projects/telegram-brief-app/FjuTnTZHLNPmpZVMeQ9KQogfYwCp",
            },
          },
        ],
      ],
    },
  });
});

bot.launch();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      await bot.handleUpdate(req.body, res);
    } catch (error) {
      console.error("Error handling update:", error);
      res.status(500).json({ error: "Error handling update" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}



