import { NextApiRequest, NextApiResponse } from "next";
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.command("start", (ctx) => {
  ctx.reply("Welcome!", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Open Web App",
            web_app: { url: "https://your-web-app-url.com" },
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
