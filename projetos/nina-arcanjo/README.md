# Nina Arcanjo: demonstração de portfólio

Portfólio e landing page de uma fotógrafa fictícia de retratos em filme e polaroid, em Ubatuba (litoral norte de SP). A direção mistura duas referências:

- **Estética de fotógrafa em Life is Strange (Max Caulfield):** polaroids presas com fita e legendas à mão, luz de fim de tarde, grão de filme, o farol e a borboleta azul. O título ("Momentos que dá vontade de rebobinar") acena para o "voltar no tempo".
- **[Landing Page for a Photographer (Behance)](https://www.behance.net/gallery/240759699/Landing-Page-for-a-Photographer):** papel cinza-quente, display fino art déco, rótulos entre parênteses, pacotes em três colunas, agendamento dentro de um visor de câmera ("REC"), depoimento com aspas grandes e nome gigante no rodapé.

Fotógrafa, clientes, depoimentos, preços e números são fictícios. As fotos são ilustrativas (Unsplash). O formulário valida os campos e mostra a mensagem que seria enviada, mas não envia nada.

## Destaques

- **Revelação de polaroid:** as fotos surgem lavadas e ganham cor e contraste, no hero (GSAP timeline) e ao rolar (ScrollTrigger).
- **Portfólio:** filtro por tipo de ensaio, colunas equilibradas por JS (cada foto vai para a coluna mais curta) e lightbox em forma de polaroid com setas e teclado.
- **Pacotes:** o botão "Quero esse" já marca o pacote no formulário.
- **Agendamento:** validação inline com mensagens claras e foco no primeiro erro.
- **Acessibilidade:** contraste AA (texto 13:1, azul 5,1:1), foco visível, alvos de 44px ou mais e `prefers-reduced-motion`. Sem GSAP, tudo aparece pronto.

## Identidade

- Papel `#DDD8D0`, tinta `#161412` e azul-borboleta `#1F4FBF` como único acento.
- Poiret One (display), Newsreader (texto) e Caveat (legendas à mão).

## Estrutura

- `index.html`: conteúdo e seções.
- `style.css`: identidade, polaroids, layout e responsividade.
- `script.js`: menu, galeria, filtro, lightbox, depoimentos e formulário.
- `motion.js`: animações de revelação.
