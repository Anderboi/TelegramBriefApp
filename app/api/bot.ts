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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: "Bot is running" });
}



