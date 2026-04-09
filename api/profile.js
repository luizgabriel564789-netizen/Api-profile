import { createCanvas, loadImage } from '@napi-rs/canvas'

export default async function handler(req, res) {
  try {
    const nome = req.query.nome || 'Usuário'
    const avatarUrl = req.query.avatar || 'https://i.imgur.com/8w0bK9X.png'
    const dinheiro = Number(req.query.reais) || 0
    const nivel = Number(req.query.nivel) || 1
    const xp = Number(req.query.xp) || 0
    const xpMax = Number(req.query.xpMax) || 100
    const fome = Number(req.query.fome) || 100
    const sede = Number(req.query.sede) || 100

    const canvas = createCanvas(900, 400)
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#0d1117'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#161b22'
    ctx.fillRect(50, 50, 800, 300)

    const dinheiroFormatado = dinheiro.toLocaleString('pt-BR')

    let avatar
    try {
      avatar = await loadImage(avatarUrl)
    } catch {
      avatar = await loadImage('https://i.imgur.com/8w0bK9X.png')
    }

    ctx.save()
    ctx.beginPath()
    ctx.arc(150, 200, 60, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(avatar, 90, 140, 120, 120)
    ctx.restore()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 28px Arial'
    ctx.fillText(nome, 250, 110)

    ctx.fillStyle = '#00ff88'
    ctx.font = '20px Arial'
    ctx.fillText(`R$ ${dinheiroFormatado}`, 250, 140)

    ctx.fillStyle = '#facc15'
    ctx.fillText(`Nivel ${nivel}`, 250, 170)

    function barra(x, y, w, h, val, max, cor) {
      ctx.fillStyle = '#30363d'
      ctx.fillRect(x, y, w, h)

      const p = val / max

      ctx.fillStyle = cor
      ctx.fillRect(x, y, w * p, h)

      ctx.fillStyle = '#fff'
      ctx.font = '14px Arial'
      ctx.fillText(Math.floor(p * 100) + '%', x + w - 40, y + 14)
    }

    ctx.fillStyle = '#fff'
    ctx.font = '16px Arial'

    ctx.fillText('XP', 250, 210)
    barra(250, 220, 500, 15, xp, xpMax, '#5865F2')

    ctx.fillText('Fome', 250, 260)
    barra(250, 270, 500, 15, fome, 100, '#ff4d4d')

    ctx.fillText('Sede', 250, 310)
    barra(250, 320, 500, 15, sede, 100, '#4da6ff')

    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 'no-store')

    res.send(canvas.toBuffer('image/png'))

  } catch (e) {
    res.status(500).send('Erro')
  }
}
