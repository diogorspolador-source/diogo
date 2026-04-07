import type { LaunchInput } from '../storage/launches.js';

export function buildMetaAdsCopyPrompt(launch: LaunchInput): string {
  const bonusesText = launch.bonuses.length > 0
    ? `Bônus incluídos:\n${launch.bonuses.map((b, i) => `${i + 1}. ${b}`).join('\n')}`
    : 'Sem bônus adicionais';

  return `Você é um especialista em copywriting para marketing digital brasileiro. Crie copies persuasivos para anúncios no Meta (Facebook/Instagram) para o seguinte lançamento de curso:

**INFORMAÇÕES DO LANÇAMENTO:**
Nome do curso: ${launch.name}
Descrição: ${launch.description}
Público-alvo: ${launch.targetAudience}
Proposta Única de Valor (USV): ${launch.usp}
Preço: R$ ${launch.price.toFixed(2)}${launch.originalPrice ? ` (de R$ ${launch.originalPrice.toFixed(2)})` : ''}
Período de captação: ${launch.captacaoStart} até ${launch.captacaoEnd}
Data da aula ao vivo: ${launch.liveDate} às ${launch.liveTime}
Plataforma: ${launch.livePlatform}
Instrutor: ${launch.instructorName}
Bio do instrutor: ${launch.instructorBio}
${bonusesText}
${launch.guarantee ? `Garantia: ${launch.guarantee}` : ''}

**TAREFA:**
Gere EXATAMENTE o seguinte JSON com copies para anúncios. Não adicione nenhum texto fora do JSON.

{
  "captacao": [
    {
      "id": "cap_1",
      "phase": "captacao",
      "format": "feed",
      "headline": "Título chamativo de até 40 caracteres",
      "primaryText": "Texto principal persuasivo de 3-5 parágrafos com emojis, falando sobre o problema do público e como o curso resolve",
      "cta": "Inscreva-se Agora"
    },
    {
      "id": "cap_2",
      "phase": "captacao",
      "format": "feed",
      "headline": "...",
      "primaryText": "...",
      "cta": "..."
    },
    {
      "id": "cap_3",
      "phase": "captacao",
      "format": "story",
      "headline": "...",
      "primaryText": "Texto mais curto para story, direto ao ponto, com urgência",
      "cta": "..."
    },
    {
      "id": "cap_4",
      "phase": "captacao",
      "format": "story",
      "headline": "...",
      "primaryText": "...",
      "cta": "..."
    },
    {
      "id": "cap_5",
      "phase": "captacao",
      "format": "reel",
      "headline": "...",
      "primaryText": "Texto para reel com gancho forte na primeira linha",
      "cta": "..."
    }
  ],
  "perpetual": [
    {
      "id": "per_1",
      "phase": "perpetual",
      "format": "feed",
      "headline": "...",
      "primaryText": "Texto para campanha perpétua, sem urgência de data, focado em transformação",
      "cta": "..."
    },
    {
      "id": "per_2",
      "phase": "perpetual",
      "format": "feed",
      "headline": "...",
      "primaryText": "...",
      "cta": "..."
    },
    {
      "id": "per_3",
      "phase": "perpetual",
      "format": "story",
      "headline": "...",
      "primaryText": "...",
      "cta": "..."
    }
  ]
}

Use linguagem brasileira autêntica, emojis relevantes, urgência genuína e copywriting baseado em dor/solução/transformação. Todos os textos devem ser em português do Brasil.`;
}

export function buildLandingPageCopyPrompt(launch: LaunchInput): string {
  return `Você é um especialista em copywriting de alta conversão para o mercado digital brasileiro. Crie o copy completo de uma página de captura (landing page) para a aula ao vivo gratuita abaixo.

**INFORMAÇÕES DO LANÇAMENTO:**
Nome do curso/evento: ${launch.name}
Descrição: ${launch.description}
Público-alvo: ${launch.targetAudience}
Proposta Única de Valor: ${launch.usp}
Data da aula ao vivo: ${launch.liveDate} às ${launch.liveTime}
Plataforma: ${launch.livePlatform}
Instrutor: ${launch.instructorName}
Bio do instrutor: ${launch.instructorBio}
${launch.bonuses.length > 0 ? `Bônus para quem se inscrever: ${launch.bonuses.join(', ')}` : ''}

**TAREFA:**
Gere EXATAMENTE o seguinte JSON. Não adicione nenhum texto fora do JSON.

{
  "headline": "Título principal impactante da landing page (até 80 caracteres, com promessa clara)",
  "subheadline": "Subtítulo complementar explicando o que a pessoa vai aprender/ganhar ao se inscrever (até 150 caracteres)",
  "benefits": [
    "Benefício específico 1 que a pessoa vai aprender/conseguir",
    "Benefício específico 2",
    "Benefício específico 3",
    "Benefício específico 4",
    "Benefício específico 5"
  ],
  "aboutInstructor": "Parágrafo de 3-4 linhas apresentando o instrutor de forma persuasiva, destacando credenciais e resultados",
  "ctaText": "Texto do botão de call-to-action (ex: 'Quero minha vaga gratuita!')"
}

Use copywriting de alta conversão, foque na transformação do público-alvo e use português do Brasil natural e persuasivo.`;
}

export function buildSalesPageCopyPrompt(launch: LaunchInput): string {
  const bonusesText = launch.bonuses.length > 0
    ? launch.bonuses.map((b, i) => `Bônus ${i + 1}: ${b}`).join('\n')
    : 'Sem bônus adicionais';

  return `Você é o melhor copywriter de páginas de vendas do Brasil. Crie o copy completo de uma página de vendas de alta conversão para o seguinte curso:

**INFORMAÇÕES DO CURSO:**
Nome: ${launch.name}
Descrição: ${launch.description}
Público-alvo: ${launch.targetAudience}
Proposta Única de Valor: ${launch.usp}
Preço: R$ ${launch.price.toFixed(2)}${launch.originalPrice ? ` (de R$ ${launch.originalPrice.toFixed(2)})` : ''}
Instrutor: ${launch.instructorName}
Bio do instrutor: ${launch.instructorBio}
${bonusesText}
${launch.guarantee ? `Garantia: ${launch.guarantee}` : 'Sem garantia'}

**TAREFA:**
Gere EXATAMENTE o seguinte JSON. Não adicione nenhum texto fora do JSON.

{
  "headline": "Título principal devastador da página de vendas (até 100 caracteres)",
  "subheadline": "Subtítulo que complementa e aprofunda a promessa do headline",
  "problemStatement": "Parágrafo de 4-6 linhas descrevendo a dor/problema do público-alvo de forma visceral e empática",
  "solution": "Parágrafo de 3-5 linhas apresentando o curso como a solução definitiva para o problema",
  "benefits": [
    "O que você vai aprender/conseguir: Benefício específico e mensurável 1",
    "O que você vai aprender/conseguir: Benefício específico e mensurável 2",
    "O que você vai aprender/conseguir: Benefício específico e mensurável 3",
    "O que você vai aprender/conseguir: Benefício específico e mensurável 4",
    "O que você vai aprender/conseguir: Benefício específico e mensurável 5",
    "O que você vai aprender/conseguir: Benefício específico e mensurável 6"
  ],
  "testimonialPlaceholders": [
    "Depoimento de aluno que conseguiu [resultado específico] em [tempo] após aplicar os ensinamentos",
    "Depoimento de aluno que superou [obstáculo específico] e atingiu [resultado]",
    "Depoimento de aluno iniciante que [transformação específica]"
  ],
  "bonusSection": "Texto persuasivo descrevendo os bônus incluídos no pacote, com valor percebido de cada um",
  "priceSection": "Texto de ancoragem de preço explicando o valor do investimento vs. o resultado que o aluno vai ter",
  "guarantee": "Texto da garantia de forma tranquilizadora e confiante${launch.guarantee ? '' : ' (crie uma garantia de satisfação de 7 dias)'}",
  "faq": [
    { "question": "Pergunta frequente relevante sobre o curso 1", "answer": "Resposta clara e persuasiva" },
    { "question": "Para quem é esse curso?", "answer": "Resposta qualificando o público ideal" },
    { "question": "Quanto tempo terei acesso?", "answer": "Resposta sobre acesso e suporte" },
    { "question": "Funciona para iniciantes?", "answer": "Resposta encorajadora e específica" },
    { "question": "Como funciona a garantia?", "answer": "Explicação detalhada da política de reembolso" }
  ],
  "ctaText": "Texto do botão principal de compra (urgente e específico)"
}

Use storytelling, prova social, urgência genuína e linguagem brasileira autêntica. Foque em transformação de vida.`;
}

export function buildYoutubeThumbnailPrompt(launch: LaunchInput): string {
  return `Você é especialista em criar títulos para thumbnails do YouTube que geram altíssima taxa de cliques (CTR) no mercado brasileiro.

**INFORMAÇÕES DO LANÇAMENTO:**
Nome do curso: ${launch.name}
Público-alvo: ${launch.targetAudience}
Proposta Única de Valor: ${launch.usp}
Instrutor: ${launch.instructorName}

**TAREFA:**
Crie textos para thumbnail do YouTube. Gere EXATAMENTE o seguinte JSON. Não adicione nenhum texto fora do JSON.

{
  "headline": "Frase de impacto para thumbnail (MÁXIMO 5 PALAVRAS, em MAIÚSCULAS, que causa curiosidade ou promete resultado)",
  "subheadline": "Complemento de até 4 palavras que especifica o benefício ou público"
}

Exemplos de bom headline: "APRENDA ISSO EM 7 DIAS", "O SEGREDO QUE NINGUÉM CONTA", "COMO EU FIZ R$10K"
O texto deve ser impactante visualmente e legível em miniatura. Use português do Brasil.`;
}
