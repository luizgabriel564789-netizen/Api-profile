    import { createCanvas, loadImage } from "@napi-rs/canvas";

export default async function handler(req, res) {
  const W = 900;
  const H = 450;

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  const username = String(req.query.user ?? "Usuario");
  const avatar = req.query.avatar || "https://cdn.discordapp.com/embed/avatars/0.png";
  const coins = Number(req.query.coins ?? 0);
  const level = Number(req.query.level ?? 0);
  const xp = Math.max(0, Number(req.query.xp ?? 0));
  const maxxp = Math.max(1, Number(req.query.maxxp ?? 100));
  const reps = Number(req.query.reps ?? 0);
  const desc = String(req.query.desc ?? "Sem descrição");

  const progress = Math.min(1, xp / maxxp);

  ctx.fillStyle = "#f5f5f5";
  ctx.fillRect(0, 0, W, H);

  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, "#9333ea");
  g.addColorStop(1, "#ec4899");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 140);

  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(200, 60, 60, 0, Math.PI * 2);
  ctx.arc(260, 60, 70, 0, Math.PI * 2);
  ctx.arc(320, 60, 60, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#111";
  ctx.font = "bold 26px sans-serif";
  wrap(ctx, desc, 30, 175, 820, 28);

  rounded(ctx, 30, 200, 440, 210, 25, "#e5e5e5");

  card(ctx, 50, 220, "💰", formatNumber(coins) + " Coins");
  card(ctx, 260, 220, "⭐", "Nível: " + level + "\n" + xp + "/" + maxxp + " XP");
  card(ctx, 50, 300, "🏅", "Badges");
  card(ctx, 260, 300, "👍", "Reps " + reps);

  rounded(ctx, 50, 365, 380, 14, 10, "#d1d5db");

  const bgBar = ctx.createLinearGradient(50, 0, 430, 0);
  bgBar.addColorStop(0, "#9333ea");
  bgBar.addColorStop(1, "#ec4899");

  rounded(ctx, 50, 365, 380 * progress, 14, 10, bgBar);

  const img = await loadImage(avatar);

  ctx.save();
  ctx.beginPath();
  ctx.arc(720, 180, 90, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(img, 630, 90, 180, 180);
  ctx.restore();

  ctx.lineWidth = 6;
  ctx.strokeStyle = "#e5e5e5";
  ctx.beginPath();
  ctx.arc(720, 180, 90, 0, Math.PI * 2);
  ctx.stroke();

  rounded(ctx, 610, 300, 220, 50, 25, "#e5e5e5");

  ctx.fillStyle = "#000";
  ctx.font = "bold 20px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(username, 720, 332);

  res.setHeader("Content-Type", "image/png");
  res.send(canvas.toBuffer("image/png"));
}

function card(ctx, x, y, icon, text) {
  rounded(ctx, x, y, 180, 65, 15, "#d1d5db");
  rounded(ctx, x, y, 60, 65, 15, "#9333ea");

  ctx.fillStyle = "#fff";
  ctx.font = "22px sans-serif";
  ctx.fillText(icon, x + 18, y + 42);

  ctx.fillStyle = "#000";
  ctx.font = "bold 14px sans-serif";

  const lines = text.split("\n");
  lines.forEach((l, i) => {
    ctx.fillText(l, x + 70, y + 25 + i * 18);
  });
}

function rounded(ctx, x, y, w, h, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

function wrap(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let offset = 0;

  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + " ";
    if (ctx.measureText(test).width > maxWidth && i > 0) {
      ctx.fillText(line, x, y + offset);
      line = words[i] + " ";
      offset += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, y + offset);
}

function formatNumber(num) {
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return String(num);
}
