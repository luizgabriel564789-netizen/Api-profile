import data from "../profile.json";

export default function handler(req, res) {

  const { id } = req.query;

  const user = data.users[id];

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  const banner = data.banners[user.bannerAtual];

  function barra(valor) {
    let cheio = "█".repeat(Math.floor(valor / 10));
    let vazio = "░".repeat(10 - cheio.length);
    return cheio + vazio;
  }

  res.status(200).json({
    banner: banner.url,
    nick: user.nick,
    avatar: user.avatar,

    dinheiro: user.dinheiro,
    banco: user.banco,

    xp: `${user.xp}/${user.xpNeed}`,

    fome: barra(user.fome),
    sede: barra(user.sede)
  });
}
