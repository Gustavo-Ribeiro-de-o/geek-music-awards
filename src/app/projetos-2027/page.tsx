import { Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui";

export default function Projetos2027Page() {
  return (
    <section className="section section--top">
      <Reveal>
        <span className="eyebrow"><Sparkles size={14} /> O futuro da GMA</span>
        <h1 className="page-title">Quem vamos premiar em 2027?</h1>
      </Reveal>

      <Reveal delay={80}>
        <div className="prose-2027">
          <p>
            Salve, rapaziada da cena geek! É com muito orgulho que inicio, em 2026, a primeira
            edição do Geek Music Awards! Como é um projeto novo, esse ano vamos premiar apenas os
            cantores — e isso tem motivos bem claros:
          </p>

          <h3>TEMPO</h3>
          <p>
            A GMA está sendo desenvolvida há aproximadamente 4 meses. Nesse período, construí um
            site que precisou de muita coisa pra funcionar direito: correção de bugs, testes de
            segurança, cuidado com a aparência e por aí vai. O tempo que tive não foi suficiente
            pra dar conta do tamanho do projeto que eu tinha em mente.
          </p>

          <h3>EQUIPE</h3>
          <p>
            Um projeto que promete ser a premiação mais profissional da cena geek precisa cometer
            o menor número de erros possível. Hoje conto só com a ajuda do meu irmão, @the kyre,
            que confere, sugere e aprova comigo — mas duas pessoas não dão conta de revisar tudo
            enquanto ainda bolam as ideias e a lógica por trás da parada.
          </p>

          <p>
            Mas a GMA está só começando! Em 2027 vamos elevar o nível: vamos premiar editores,
            designers, mangakás da cena, produtores e muita gente responsável pelos projetos
            incríveis que a gente tanto ama no universo geek!
          </p>

          <p>
            Se a edição de 2026 for um sucesso, esperem premiações ainda maiores, eventos
            presenciais com os melhores da cena, e muito mais!
          </p>
        </div>
      </Reveal>
    </section>
  );
}
