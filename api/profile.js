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

    const canvas = createCanvas(900, 350)
    const ctx = canvas.getContext('2d')

    // FUNDO
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // CARREGAR AVATAR
    let avatar
    try {
      avatar = await loadImage(avatarUrl)
    } catch {
      avatar = await loadImage('https://i.imgur.com/8w0bK9X.png')
    }

    // AVATAR REDONDO
    ctx.save()
    ctx.beginPath()
    ctx.arc(120, 175, 80, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(avatar, 40, 95, 160, 160)
    ctx.restore()

    // NOME
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 32px sans-serif'
    ctx.fillText(nome, 240, 80)

    // DINHEIRO
    ctx.fillStyle = '#00ff88'
    ctx.font = '26px sans-serif'
    ctx.fillText(`💰 ${dinheiro}`, 240, 120)

    // NÍVEL
    ctx.fillStyle = '#facc15'
    ctx.fillText(`⭐ Nível: ${nivel}`, 240, 160)

    // FUNÇÃO DE BARRA
    function barra(x, y, largura, altura, valor, max, cor) {
      ctx.fillStyle = '#1f2937'
      ctx.fillRect(x, y, largura, altura)

      const porcentagem = Math.max(0, Math.min(1, valor / max))
      ctx.fillStyle = cor
      ctx.fillRect(x, y, largura * porcentagem, altura)

      return Math.floor(porcentagem * 100)
    }

    // XP
    ctx.fillStyle = '#ffffff'
    ctx.fillText('XP', 240, 200)
    const xpPorc = barra(240, 210, 500, 18, xp, xpMax, '#5865F2')
    ctx.fillText(`${xp}/${xpMax} (${xpPorc}%)`, 240, 235)

    // FOME
    ctx.fillText('🍗 Fome', 240, 265)
    const fomePorc = barra(240, 275, 500, 18, fome, 100, '#ef4444')
    ctx.fillText(`${fome}%`, 240, 300)

    // SEDE
    ctx.fillText('💧 Sede', 240, 325)
    const sedePorc = barra(240, 335, 500, 18, sede, 100, '#3b82f6')
    ctx.fillText(`${sede}%`, 240, 360)

    res.setHeader('Content-Type', 'image/png')
    res.send(canvas.toBuffer('image/png'))

  } catch (err) {
    console.error(err)
    res.status(500).send('Erro na API')
  }
}
