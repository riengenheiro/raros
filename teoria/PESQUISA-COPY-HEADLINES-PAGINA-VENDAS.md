# Pesquisa de copy: headlines, páginas de venda e curiosidade linha a linha

Complemento de `PESQUISA-ALICERCE-IE-LIDERANCA-NEGOCIO-CAMPINAS.md`. Aquela pesquisa diz **o que** a persona sente e fala. Esta diz **como** organizar a página. Usada para reescrever `src/pages/v2.astro`.

**Aviso de método.** Esta pesquisa não tem a mesma régua de evidência literal da pesquisa da persona. Aqui as fontes são livros clássicos de copywriting (conhecidos de segunda mão), um estudo acadêmico, pesquisa de usabilidade e blogs de empresas que vendem ferramentas de landing page. Blogs de fornecedores têm interesse comercial em mostrar que "otimizar converte mais". Por isso cada princípio tem um **grau de confiança**. Nenhum número de "aumento de conversão" de blog foi usado como promessa para o seu caso.

---

## 1. Headlines de alta conversão

| Princípio | Fonte | Confiança | Como foi aplicado na v2 |
|---|---|---|---|
| A headline tem de ser lida por quase todos, então precisa carregar a ideia central. Quem só lê o título tem de entender a oferta. | Ogilvy (livro clássico) e Caples (teste de anúncios, citados por fontes secundárias) | Média: livros de prática, sem teste controlado atual | Topo da página já mostra data, local e preço (barra fixa e faixa de resumo), não só a frase de impacto |
| Falar do interesse do leitor, não de quem vende. Notícia e benefício específico funcionam melhor que frase "bonita". | Caples e Ogilvy | Média | Subtítulo diz o que a pessoa aprende (conduzir conversas, construir confiança, decidir) |
| Adequar a headline ao nível de consciência do leitor: quem já sente a dor responde a quem a descreve; quem não sente precisa ser educado primeiro. | Schwartz, "Breakthrough Advertising" | Média | Público de empresário já sente a dor ("se eu não fizer, ninguém faz" aparece na pesquisa). A headline nomeia a dor em vez de explicar o que é inteligência emocional |
| Especificidade (números, nomes, prazos) aumenta credibilidade, mas há ponto ótimo: concreto demais em coisa irrelevante cansa. | Meta-análise acadêmica sobre concretude da linguagem (PMC), relação em curva | Alta como estudo, mas não é de anúncios | Números só onde ajudam: 9h às 17h, R$ 197, 100% até 2/dez, 1913 |
| Combinar a promessa do anúncio com a promessa da página ("message match"). A pessoa que clica espera ver a mesma ideia. | Blogs de Scaletrics, Thesis e LiftArchive (fornecedores) | Baixa a média: lógica sólida, números vindos de interessados | Seu Story usa "Se eu não fizer, ninguém faz." A h1 da v2 usa exatamente essa frase |

**Limite importante:** nenhuma fonte garante que a headline "Se eu não fizer, ninguém faz." será a vencedora. É hipótese com base na pesquisa da persona. O jeito de saber é teste A/B (ver seção 5).

---

## 2. Páginas de venda e páginas de evento

| Princípio | Fonte | Confiança | Aplicação na v2 |
|---|---|---|---|
| Revelar as informações essenciais logo: o que é, quando, onde, quanto. Esconder preço ou programa gera desconfiança. | Nielsen Norman Group (pesquisa de usabilidade, divulgação antecipada de informação) | Alta para usabilidade | Barra fixa e faixa de resumo mostram data, local, preço e reembolso |
| Pessoas escaneiam, não leem. Subtítulos devem ser **descritivos** (dizer o que vem) e não enigmáticos. | Nielsen Norman Group | Alta | H2 como "Como é o dia, do credenciamento ao encerramento" e "Quem conduz o dia" |
| Estrutura típica de página de evento: topo claro, para quem é, o que se leva, programa, quem apresenta, ingresso com o que inclui e política de reembolso, prova social, perguntas frequentes, chamada final. | Guias de plataformas de ingresso e landing page (fontes de fornecedores; padrão observado em várias) | Baixa a média: convenção de mercado, não estudo | Ordem da v2: topo, reconhecimento, o que vive, programa, palestrantes, depoimentos, local, ingressos, garantia, FAQ |
| Programa visível aumenta a confiança de quem vai pagar por um dia inteiro. | Mesmas fontes de página de evento | Baixa a média | Seção "Como é o dia" criada, só com horários confirmados |
| Prova social perto da decisão (depoimentos, quem já participou). | Várias fontes de marketing | Média | Depoimentos em vídeo antes do ingresso |

---

## 3. Fazer cada linha gerar curiosidade para a próxima

| Princípio | Fonte | Confiança | Aplicação |
|---|---|---|---|
| "Slippery slide": o único objetivo da primeira frase é fazer ler a segunda, e assim por diante até o botão. | Joseph Sugarman, "Advertising Secrets of the Written Word" (conhecido por fontes secundárias) | Média: método de prática de um redator, não pesquisa | Cada seção termina com uma frase-ponte curta ("Veja se você se reconhece.", "E o que acontece, exatamente, do começo ao fim do dia?", "Agora, quem conduz tudo isso.") |
| "Seeds of curiosity": frases curtas, perguntas implícitas, promessa de explicar depois. | Sugarman | Média | Mesmo recurso, sempre antes de uma seção que realmente responde |
| Lacuna de informação (information gap): curiosidade nasce quando a pessoa sabe um pouco e percebe que falta o resto. Gap pequeno demais não interessa, gap grande demais frustra, e a resposta tem de vir logo. | Loewenstein, teoria da lacuna de informação (artigo acadêmico, 1994) | Alta como teoria psicológica, não testada em páginas de evento | A ponte nunca esconde o que importa (preço e horário estão no topo). Ela só antecipa o que vem na sequência, e a resposta vem na seção seguinte |
| Declarações verdadeiras e curtas mantêm a confiança; exagero quebra a descida. | Sugarman (axioma sobre afirmações verdadeiras) | Média | Evitei contador falso, "99% do mercado", escassez fixa e "vagas esgotaram" |

**Cuidado:** curiosidade usada para esconder preço, programa ou garantia piora a confiança (NN/g). Por isso as pontes só aparecem entre blocos, nunca no lugar da informação.

---

## 4. Decisões de copy que dependem de dado que ainda falta

Marcadas como pendências dentro de `v2.astro` (comentário que não aparece na página):

1. Temas do treinamento, hora a hora.
2. O que a pessoa leva para casa.
3. Se almoço e coffee break estão inclusos no ingresso.
4. Se haverá oferta de outros produtos no evento (a pesquisa mostrou isso como objeção).
5. Como é a dinâmica de networking (exposição, falar em público).
6. Se houver virada de lote, data e novo valor (só assim entra urgência real).
7. Legenda dos depoimentos (nome, cargo, o que mudou).

---

## 5. Como saber se a v2 funciona (sem achismo)

- Hoje o anúncio tem poucos dados (R$ 22,67 investidos, 1.195 impressões). É cedo para concluir qualquer coisa sobre a página.
- Medir: cliques no link, taxa de clique, visualizações da página de destino, cliques em "Quero meu ingresso", ingressos vendidos.
- Teste: manter a página atual e a v2 recebendo anúncios iguais, em conjuntos separados, com a mesma verba, e comparar **vendas por clique**.
- Dado necessário: integrar Hotmart e Meta para registrar a compra (Purchase). Hoje só existe ViewContent e InitiateCheckout.

---

## 6. Dados usados na v2 e a origem

| Dado | Origem | Observação |
|---|---|---|
| 9,3 h por dia; 78% trabalham aos sábados; 45% dizem que falta tempo | Sebrae-SP, pesquisa "Tempo do empreendedor", 800 empreendedores paulistas | Confirmar o ano da pesquisa antes de publicar |
| Tênis Clube fundado em 1913, mais de 8,5 mil sócios | Mídia kit do evento (`midiakit.astro`) | Informação sua |
| Bios de Leandro e Guaciara, 20 anos, 21 anos, 12.000 pessoas treinadas | Mídia kit do evento | São números de vocês; confirmar |
| Horários, preços, reembolso até 2/dez | Informado por você | |

Escolhi **não** usar nomes de celebridades que aparecem na bio do Leandro no mídia kit. Se quiser, é uma decisão sua, pois pode ajudar ou soar vaidoso para esse público (não há evidência na pesquisa para qualquer lado).
