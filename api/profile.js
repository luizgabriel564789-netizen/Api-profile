import fs from "fs";
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";

GlobalFonts.registerFromPath("./fonts/Inter-Bold.ttf", "Inter");

export default async function handler(req, res) {

  const data = JSON.parse(fs.readFileSync("./profile.json", "utf-8"));
  const { id } = req.query;

  const user = data.users[id];
  if (!user) return res.status(404).send("User not found");

  const banner = data.banners[user.bannerAtual];

  const canvas = createCanvas(900, 400);
  const ctx = canvas.getContext("2d");

  const bg = await loadImage(banner.url);
  ctx.drawImage(bg, 0, 0, 900, 200);

  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, 900, 200);

  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 200, 900, 200);

  const avatar = await loadImage(user.avatar);
  ctx.save();
  ctx.beginPath();
  ctx.arc(120, 200, 70, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, 50, 130, 140, 140);
  ctx.restore();

  ctx.font = "bold 40px Inter";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(user.nick, 220, 190);

  ctx.font = "24px Inter";
  ctx.fillStyle = "#22c55e";
  ctx.fillText(`💰 ${user.dinheiro}`, 220, 230);

  ctx.fillStyle = "#60a5fa";
  ctx.fillText(`🏦 ${user.banco}`, 220, 260);

  const xpPercent = user.xp / user.xpNeed;

  ctx.fillStyle = "#1e293b";
  ctx.fillRect(220, 290, 400, 20);

  ctx.fillStyle = "#a855f7";
  ctx.fillRect(220, 290, 400 * xpPercent, 20);

  ctx.fillStyle = "#fff";
  ctx.font = "18px Inter";
  ctx.fillText(`${user.xp}/${user.xpNeed}`, 630, 305);

  function drawBar(x, y, value, color, emoji) {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(x, y, 200, 15);

    ctx.fillStyle = color;
    ctx.fillRect(x, y, 200 * (value / 100), 15);

    ctx.fillStyle = "#fff";
    ctx.font = "16px Inter";
    ctx.fillText(emoji, x - 25, y + 12);
  }

  drawBar(650, 230, user.fome, "#f59e0b", "🍗");
  drawBar(650, 260, user.sede, "#3b82f6", "💧");

  res.setHeader("Content-Type", "image/png");
  res.send(canvas.toBuffer("image/png"));
}
