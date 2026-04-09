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
    const xpPorc = Math.floor((xp / xpMax) * 100)

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

    ctx.fillStyle = '#ffffff'
    ctx.font = '18px Arial'

    ctx.fillText(`XP: ${xp}/${xpMax} (${xpPorc}%)`, 250, 220)
    ctx.fillText(`Fome: ${fome}%`, 250, 260)
    ctx.fillText(`Sede: ${sede}%`, 250, 300)

    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 'no-store')

    res.send(canvas.toBuffer('image/png'))

  } catch (e) {
    res.status(500).send('Erro')
  }
}
