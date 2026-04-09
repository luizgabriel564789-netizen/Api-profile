import { createCanvas, loadImage } from '@napi-rs/canvas'

export default async function handler(req, res) {
  try {
    res.send("API funcionando 😈")
  } catch (err) {
    res.status(500).send('Erro')
  }
}
