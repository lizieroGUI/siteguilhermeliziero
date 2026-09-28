# Estúdio Prumo: demonstração de portfólio

Redesign de um site de arquitetura e interiores recebido pronto (feito por outra IA). O trabalho foi feito em três etapas: auditoria independente (conversão, hierarquia, responsividade e qualidade técnica, classificada em P0/P1/P2), melhorias incrementais sem recomeçar o projeto e uma camada de motion com GSAP usada só onde guia a leitura.

Marca, arquiteta, CAU, endereço, números e nomes de projetos são fictícios. As fotos são ilustrativas (Unsplash). Nenhum botão inicia conversa: os CTAs abrem um aviso de projeto demonstrativo.

## O que mudou em relação ao site original

- Hero com promessa específica, cidade e público, CTA único ("Conversar no WhatsApp") e uma linha que reduz o risco do clique.
- Portfólio antes dos serviços, assinatura da responsável técnica e nova seção "Como funciona".
- Headline de 6 para 3 linhas no desktop, fonte Geist, contraste AA nos textos secundários e foco visível.
- Open Graph, favicon e imagens responsivas (`srcset`).
- Motion (GSAP + ScrollTrigger + SplitText via CDN): entrada do hero, títulos por linha, contadores, portfólio, linha das etapas. Tudo desliga com `prefers-reduced-motion` e a página funciona sem o GSAP.

## Estrutura

- `index.html`: conteúdo e seções.
- `styles.css`: layout, identidade (acento laranja Corten `#E4572E`) e responsividade.
- `script.js`: menu mobile, aviso da demo, botão flutuante e FAQ.
- `motion.js`: animações.

Para publicar junto ao portfólio, mantenha esta pasta em `projetos/estudio-prumo/`.
