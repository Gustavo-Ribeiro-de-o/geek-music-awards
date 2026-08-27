import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ARTISTS = [
  { slug: "anirap", name: "AniRap" },
  { slug: "m4rkim", name: "M4rkim" },
  { slug: "lucas-art", name: "Lucas A.R.T" },
  { slug: "pedro-alves", name: "Pedro Alves" },
  { slug: "gabriel-rodrigues", name: "Gabriel Rodrigues" },
  { slug: "kaito", name: "Kaito" },
  { slug: "okabe", name: "Okabe" },
  { slug: "ishida", name: "Ishida" },
  { slug: "chrono", name: "Chrono" },
  { slug: "flash-beats", name: "Flash Beats" },
  { slug: "takab", name: "TakaB" },
  { slug: "vitchbeats", name: "VitchBeats" },
  { slug: "albk", name: "ALBK" },
  { slug: "enygma", name: "Enygma" },
  { slug: "darui", name: "Darui" },
  { slug: "basara", name: "Basara" },
  { slug: "mhrap", name: "MHRAP" },
  { slug: "henrique-mendonca", name: "Henrique Mendonça" },
  { slug: "eodan", name: "ÉoDan" },
  { slug: "ninja-raps", name: "Ninja Raps" },
  { slug: "second-time", name: "Second Time" },
  { slug: "blxck", name: "Blxck" },
  { slug: "novatroop", name: "Novatroop" },
  { slug: "pejota", name: "Pejota" },
  { slug: "anny", name: "Anny" },
  { slug: "dya", name: "DYA" },
  { slug: "ravanello", name: "Ravanello" },
  { slug: "santo", name: "Santo" },
  { slug: "dnrap", name: "DNRAP" },
  { slug: "ark", name: "Ark King" },
  { slug: "mxth", name: "Mxth" },
  { slug: "neshyzk", name: "Neshyzk" },
  { slug: "yokai", name: "Yokai" },
  { slug: "degrade-rapz", name: "Degradê Rapz" },
  { slug: "coliado", name: "Coliado" },
  { slug: "as-ace", name: "As Ace" },
  { slug: "bachira-music", name: "Bachira Music" },
  { slug: "orionoz", name: "OrionOz" },
  { slug: "takeru", name: "Takeru" },
  { slug: "sidney-scaccio", name: "Sidney Scaccio" },
  { slug: "vg-beats", name: "VG Beats" },
  { slug: "tk-raps", name: "TK RAPS" },
  { slug: "felicia-rock", name: "Felícia Rock" },
  { slug: "shooter-sz", name: "Shooter_sz" },
  { slug: "gabriza", name: "Gabriza" },
  { slug: "papyrus-da-batata", name: "Papyrus Da Batata" },
  { slug: "iron-master", name: "Iron Master" },
  { slug: "vmz", name: "VMZ" },
  { slug: "wlo", name: "WLO" },
  { slug: "player-tauz", name: "Player Tauz" },
  { slug: "rodrigo-zin", name: "Rodrigo Zin" },
  { slug: "raphyx", name: "Raphyx" },
  { slug: "neko", name: "Neko" },
  { slug: "akinno", name: "AKINNO" },
  { slug: "mistery", name: "Mistery" },
  { slug: "shiny-sz", name: "Shiny_sz" },
  { slug: "tec", name: "Tec" },
  { slug: "oshaman", name: "oShaman" },
  { slug: "nikmouu", name: "nikmouu" },
  { slug: "lhz", name: "LHZ" },
  { slug: "igris", name: "igris" },
  { slug: "hawky", name: "Hawky" },
  { slug: "slow-gm", name: "Slow GM" },
  { slug: "ranori", name: "Ranori" },
  { slug: "kaji", name: "Kaji" },
  { slug: "duelista", name: "Duelista" },
  { slug: "mands", name: "mands" },
  { slug: "blaze-rapper", name: "BLAZE RAPPER" },
  { slug: "jiorzin", name: "jiorzin" },
  { slug: "theuz", name: "Theuz" },
];

const CATEGORIES = [
  { slug: "melhor-voz", name: "Melhor Voz" },
  { slug: "melhor-interpretacao", name: "Melhor Interpretação" },
  { slug: "melhor-flow", name: "Melhor Flow" },
];

async function main() {
  for (const artist of ARTISTS) {
    await prisma.artist.upsert({ where: { slug: artist.slug }, update: { name: artist.name }, create: artist });
  }
  for (const category of CATEGORIES) {
    await prisma.category.upsert({ where: { slug: category.slug }, update: {}, create: category });
  }
  console.log(`Seed concluído: ${ARTISTS.length} artistas, ${CATEGORIES.length} categorias.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
