# Valorant Hub

App mobile real (Expo + React Native + Expo Router) inspirado no protótipo "Valorant app-post". Mantém o mesmo visual mas com a estrutura simplificada, sem APIs reais da Riot e sem dados de jogador.

## Stack
- Expo SDK 51 (Expo Router 3 — file-based routing)
- React Native 0.74 + React Native Web 0.19 (preview no navegador)
- React 18.2
- @expo-google-fonts/inter (fontes Inter 400/500/600/700)
- @expo/vector-icons (Feather)
- react-native-safe-area-context
- Dados de jogo (agentes, armas, mapas, skins): https://valorant-api.com (público, sem auth)

## Estrutura de pastas
- `app/` — telas (Expo Router)
  - `index.jsx` — redireciona para `/login`
  - `login.jsx` — login simples (apenas botão "Entrar", sem auth real)
  - `home.jsx` — grid de categorias (Agentes, Armas, Mapas, Perfil)
  - `agents.jsx` — lista de agentes com filtro por classe (Duelista, Iniciador, Sentinela, Controlador) + busca
  - `agent-detail.jsx` — detalhe do agente: portrait, descrição/lore, função e habilidades com ícones
  - `weapons.jsx` — lista de armas com busca
  - `weapon-detail.jsx` — detalhe da arma: imagem, estatísticas (taxa de disparo, pente, recarga), dano por distância e botão "Ver Skins"
  - `weapon-skins.jsx` — grade de skins daquela arma (com cromas)
  - `maps.jsx` — lista de mapas com filtro Todos/Rotação competitiva
  - `banners.jsx` — grade de cartões de jogador com busca e modal
  - `sprays.jsx` — grade de sprays com busca e modal (mostra GIF se animado)
  - `titles.jsx` — lista de títulos de jogador com busca
  - `seasons.jsx` — lista de temporadas (episódios) com datas + busca
  - `season-detail.jsx` — detalhe do episódio com sumário e lista de atos
  - `act-detail.jsx` — detalhe do ato com início/término/duração + botão "VER TOP 100 JOGADORES"
  - `leaderboard.jsx` — top 100 do ato selecionado (HenrikDev API, requer secret HDEV_API_KEY); seletor de região; busca; mostra nome, banner (cartão) e título do jogador. Sem chave, exibe mensagem explicativa.
  - `profile.jsx` — perfil fictício + aviso sobre RSO
  - `_layout.jsx` — Stack root, carrega fontes Inter, esconde splash
- `components/`
  - `CategoryCard.jsx`, `ScreenHeader.jsx`
  - `LoadingScreen.jsx` — spinner padrão
  - `ErrorView.jsx` — tela de erro com botão "Tentar novamente"
- `constants/colors.js`, `hooks/useColors.js` — design tokens (paleta dark estilo Valorant)

## Regras importantes (impostas pelo escopo do projeto)
- Sem Riot Games API (oficial), sem busca de Riot ID, sem WebView, sem store checker
- Sem KDA / ACS / win rate / histórico de partidas
- Login não autentica de verdade — apenas navega
- Perfil mostra layout + mensagem: "Estatísticas completas estarão disponíveis após integração com Riot Sign On (RSO)."
- A `valorant-api.com` é uma API comunitária pública somente com dados de assets do jogo (imagens, descrições, habilidades), não dados de jogador

## Replit setup
- Workflow `Start application` roda `CI=1 npx expo start --web --port 5000 --host lan`. Porta 5000 é a única suportada pelo preview web.
- `CI=1` evita prompt interativo para instalar TypeScript.
- `app.json` declara `platforms: ["ios", "android", "web"]` e `web.bundler: "metro"`.
- O usuário pode escanear o QR code da barra de URL no Replit para abrir o app no Expo Go (mobile real).

## Deploy
- Configurado como deploy estático.
- Build: `npx expo export --platform web`
- Diretório público: `dist`
