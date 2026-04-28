const express = require("express");
const { createCanvas, loadImage, registerFont } = require("canvas");

const app = express();

app.get("/profile", async (req, res) => {

const {
  username = "User#0000",
  avatar,
  banner,
  level = 1,
  xp = 26,
  money = 0,
  bank = 100,
  job = "Gari",
  rank = 0
} = req.query;

const canvas = createCanvas(3840, 2160);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#0f172a";
ctx.fillRect(0, 0, canvas.width, canvas.height);

if (banner) {
  const bg = await loadImage(banner);
  ctx.drawImage(bg, 600, 0, 3240, 900);
}

ctx.fillStyle = "#1e2a78";
ctx.fillRect(0, 0, 600, 2160);

ctx.fillStyle = "#ffffff";
ctx.font = "80px Arial";
ctx.fillText("RANK", 150, 200);
ctx.font = "120px Arial";
ctx.fillText(rank, 220, 350);

if (avatar) {
  const av = await loadImage(avatar);

  ctx.save();
  ctx.beginPath();
  ctx.arc(300, 1100, 220, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(av, 80, 880, 440, 440);
  ctx.restore();
}

ctx.fillStyle = "rgba(0,0,0,0.4)";
ctx.fillRect(600, 800, 2600, 200);

ctx.fillStyle = "#ffffff";
ctx.font = "100px Arial";
ctx.fillText(username, 650, 930);

ctx.beginPath();
ctx.arc(3300, 400, 220, 0, Math.PI * 2);
ctx.fillStyle = "#e5e7eb";
ctx.fill();

ctx.fillStyle = "#000";
ctx.font = "60px Arial";
ctx.fillText("LEVEL", 3200, 300);
ctx.font = "120px Arial";
ctx.fillText(level, 3250, 420);
ctx.font = "60px Arial";
ctx.fillText(xp + "%", 3230, 520);

function box(y, text) {
  ctx.fillStyle = "#c4b5fd";
  ctx.fillRect(700, y, 2400, 120);

  ctx.fillStyle = "#000";
  ctx.font = "70px Arial";
  ctx.fillText(text, 750, y + 85);
}

box(1200, `$${money} | Bank: $${bank}`);
box(1400, `💼 ${job}`);

res.set("Content-Type", "image/png");
res.send(canvas.toBuffer());

});

app.listen(3000);
