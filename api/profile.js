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

    const bgUrl = req.query.background

    const canvas = createCanvas(900, 420)
    const ctx = canvas.getContext('2d')

    try {
      if (bgUrl) {
        const bg = await loadImage(bgUrl)
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
      } else {
        throw 'sem bg'
      }
    } catch {
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const dinheiroFormatado = dinheiro.toLocaleString('pt-BR')

    let avatar
    try {
      avatar = await loadImage(avatarUrl)
    } catch {
      avatar = await loadImage('https://i.imgur.com/8w0bK9X.png')
    }

    ctx.save()
    ctx.beginPath()
    ctx.arc(120, 175, 80, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(avatar, 40, 95, 160, 160)
    ctx.restore()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 32px sans-serif'
    ctx.fillText(nome, 240, 80)

    ctx.fillStyle = '#00ff88'
    ctx.font = 'bold 26px sans-serif'
    ctx.fillText(`R$ ${dinheiroFormatado}`, 240, 120)

    ctx.fillStyle = '#facc15'
    ctx.fillText(`Nivel: ${nivel}`, 240, 160)

    function barra(x, y, largura, altura, valor, max, cor) {
      ctx.fillStyle = '#1f2937'
      ctx.fillRect(x, y, largura, altura)

      const porcentagem = Math.max(0, Math.min(1, valor / max))

      ctx.fillStyle = cor
      ctx.fillRect(x, y, largura * porcentagem, altura)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 16px sans-serif'
      ctx.fillText(`${Math.floor(porcentagem * 100)}%`, x + largura + 10, y + 14)
    }

    ctx.fillStyle = '#ffffff'
    ctx.font = '20px sans-serif'
    ctx.fillText('XP', 240, 200)
    barra(240, 210, 500, 18, xp, xpMax, '#5865F2')
    ctx.fillText(`${xp}/${xpMax}`, 240, 235)

    ctx.fillText('Fome', 240, 270)
    barra(240, 280, 500, 18, fome, 100, '#ef4444')

    ctx.fillText('Sede', 240, 330)
    barra(240, 340, 500, 18, sede, 100, '#3b82f6')

    res.setHeader('Content-Type', 'image/png')
    res.send(canvas.toBuffer('image/png'))

  } catch (err) {
    console.error(err)
    res.status(500).send('Erro na API')
  }
}
