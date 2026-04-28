const express = require("express");
const { createCanvas, loadImage } = require("canvas");

const app = express();

app.get("/profile", async (req, res) => {

const {
  username = "User#0000",
  avatar,
  banner,
  level = 1,
  xp = 260,
  maxxp = 1000,
  money = 0,
  bank = 100,
  job = "Gari",
  rank = 0
} = req.query;

const canvas = createCanvas(3840, 2160);
const ctx = canvas.getContext("2d");

const percent = Math.min(xp / maxxp, 1);

ctx.fillStyle = "#0b0f1a";
ctx.fillRect(0, 0, canvas.width, canvas.height);

if (banner) {
  const bg = await loadImage(banner);
  ctx.drawImage(bg, 500, 0, 3340, 900);
}

const gradient = ctx.createLinearGradient(0,0,0,2160);
gradient.addColorStop(0,"#1e3a8a");
gradient.addColorStop(1,"#020617");
ctx.fillStyle = gradient;
ctx.fillRect(0,0,500,2160);

ctx.fillStyle = "#fff";
ctx.font = "90px Arial";
ctx.fillText("RANK", 120, 200);
ctx.font = "140px Arial";
ctx.fillText(rank, 150, 350);

if (avatar) {
  const av = await loadImage(avatar);

  ctx.save();
  ctx.beginPath();
  ctx.arc(250, 1050, 220, 0, Math.PI * 2);
  ctx.clip();

  ctx.drawImage(av, 30, 830, 440, 440);
  ctx.restore();

  ctx.beginPath();
  ctx.arc(250, 1050, 240, 0, Math.PI * 2);
  ctx.strokeStyle = "#7c3aed";
  ctx.lineWidth = 12;
  ctx.shadowColor = "#7c3aed";
  ctx.shadowBlur = 25;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

ctx.fillStyle = "rgba(0,0,0,0.5)";
ctx.fillRect(500, 750, 2600, 220);

ctx.fillStyle = "#fff";
ctx.font = "110px Arial";
ctx.fillText(username, 550, 900);

ctx.fillStyle = "#111827";
ctx.fillRect(550, 1050, 2500, 80);

ctx.fillStyle = "#22c55e";
ctx.fillRect(550, 1050, 2500 * percent, 80);

ctx.fillStyle = "#fff";
ctx.font = "50px Arial";
ctx.fillText(`${xp} / ${maxxp} XP`, 600, 1110);

ctx.beginPath();
ctx.arc(3300, 350, 220, 0, Math.PI * 2);
ctx.fillStyle = "#e5e7eb";
ctx.fill();

ctx.strokeStyle = "#22c55e";
ctx.lineWidth = 20;
ctx.beginPath();
ctx.arc(3300, 350, 200, -Math.PI/2, (-Math.PI/2)+(Math.PI*2*percent));
ctx.stroke();

ctx.fillStyle = "#000";
ctx.font = "60px Arial";
ctx.fillText("LEVEL", 3180, 260);
ctx.font = "120px Arial";
ctx.fillText(level, 3230, 380);

function card(y, icon, text) {
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(600, y, 2400, 140);

  ctx.fillStyle = "#fff";
  ctx.font = "70px Arial";
  ctx.fillText(icon, 650, y + 95);

  ctx.fillText(text, 750, y + 95);
}

card(1250, "💰", `$${money}`);
card(1450, "🏦", `$${bank}`);
card(1650, "💼", job);

res.set("Content-Type", "image/png");
res.send(canvas.toBuffer());

});

app.listen(3000);
