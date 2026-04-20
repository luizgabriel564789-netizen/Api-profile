  import { createCanvas, loadImage } from "@napi-rs/canvas";

export default async function handler(req, res) {
  const width = 900;
  const height = 450;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const username = String(req.query.user ?? "Usuario");
  const avatar = req.query.avatar || "https://cdn.discordapp.com/embed/avatars/0.png";
  const coins = String(req.query.coins ?? "0");
  const nivel = String(req.query.level ?? "0");
  const xpAtual = Math.max(0, Number(req.query.xp ?? 0));
  const xpMax = Math.max(1, Number(req.query.maxxp ?? 100));
  const reps = String(req.query.reps ?? "0");
  const descricao = String(req.query.desc ?? "Sem descrição");

  const progress = Math.min(1, xpAtual / xpMax);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, "#c084fc");
  gradient.addColorStop(1, "#f472b6");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, 140);

  ctx.globalAlpha = 0.15;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(200, 60, 50, 0, Math.PI * 2);
  ctx.arc(260, 60, 60, 0, Math.PI * 2);
  ctx.arc(320, 60, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#111";
  ctx.font = "bold 26px sans-serif";
  drawMultilineText(ctx, descricao, 30, 180, 800, 28);

  ctx.fillStyle = "#e5e5e5";
  roundRect(ctx, 30, 200, 420, 200, 25, true);

  drawCard(ctx, 50, 220, "💰", `${coins} Coins`);
  drawCard(ctx, 250, 220, "⭐", `Nível: ${nivel}\n${xpAtual}/${xpMax} XP`);
  drawCard(ctx, 50, 300, "🏅", "Badges");
  drawCard(ctx, 250, 300, "👍", `Reps ${reps}`);

  ctx.fillStyle = "#d1d5db";
  roundRect(ctx, 50, 360, 350, 15, 10, true);

  const barGradient = ctx.createLinearGradient(50, 0, 400, 0);
  barGradient.addColorStop(0, "#9333ea");
  barGradient.addColorStop(1, "#ec4899");

  ctx.fillStyle = barGradient;
  roundRect(ctx, 50, 360, 350 * progress, 15, 10, true);

  const img = await loadImage(avatar);

  ctx.save();
  ctx.beginPath();
  ctx.arc(700, 180, 90, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, 610, 90, 180, 180);
  ctx.restore();

  ctx.lineWidth = 6;
  ctx.strokeStyle = "#e5e5e5";
  ctx.beginPath();
  ctx.arc(700, 180, 90, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#e5e5e5";
  roundRect(ctx, 600, 290, 200, 50, 25, true);

  ctx.fillStyle = "#000";
  ctx.font = "bold 20px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(username, 700, 322);

  const buffer = canvas.toBuffer("image/png");

  res.setHeader("Content-Type", "image/png");
  res.send(buffer);
}

function drawCard(ctx, x, y, icon, text) {
  ctx.fillStyle = "#d1d5db";
  roundRect(ctx, x, y, 170, 60, 15, true);

  ctx.fillStyle = "#9333ea";
  roundRect(ctx, x, y, 55, 60, 15, true);

  ctx.fillStyle = "#fff";
  ctx.font = "22px sans-serif";
  ctx.fillText(icon, x + 15, y + 38);

  ctx.fillStyle = "#000";
  ctx.font = "bold 14px sans-serif";

  const lines = text.split("\n");
  lines.forEach((line, i) => {
    ctx.fillText(line, x + 65, y + 22 + i * 18);
  });
}

function roundRect(ctx, x, y, width, height, radius, fill) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) ctx.fill();
}

function drawMultilineText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let offsetY = 0;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, x, y + offsetY);
      line = words[i] + " ";
      offsetY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y + offsetY);
}
