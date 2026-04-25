# Valorant Hub

App mobile real (Expo + React Native + Expo Router) inspirado no protótipo "Valorant app-post". Mantém o mesmo visual mas com a estrutura simplificada, sem APIs reais da Riot e sem dados de jogador.

## Stack
- Expo SDK 51 (Expo Router 3 — file-based routing)
- React Native 0.74 + React Native Web 0.19 (preview no navegador)
- React 18.2
- @expo-google-fonts/inter (fontes Inter 400/500/600/700)
- @expo/vector-icons (Feather)
- react-native-safe-area-context

## Estrutura de pastas
- `app/` — telas (Expo Router)
  - `index.jsx` — redireciona para `/login`
  - `login.jsx` — login simples (apenas botão "Entrar", sem auth real)
  - `home.jsx` — grid de categorias (Agentes, Armas, Mapas, Perfil)
  - `agents.jsx`, `weapons.jsx`, `maps.jsx` — listagens com dados mockados
  - `profile.jsx` — perfil fictício + aviso sobre RSO
  - `_layout.jsx` — Stack root, carrega fontes Inter, esconde splash
- `components/` — `CategoryCard.jsx`, `ScreenHeader.jsx`
- `data/mock/` — `agents.js`, `weapons.js`, `maps.js`
- `constants/colors.js`, `hooks/useColors.js` — design tokens (paleta dark estilo Valorant)

## Regras importantes (impostas pelo escopo do projeto)
- Sem Riot API, sem busca de Riot ID, sem WebView, sem store checker
- Sem KDA / ACS / win rate / histórico de partidas
- Login não autentica de verdade — apenas navega
- Perfil mostra layout + mensagem: "Estatísticas completas estarão disponíveis após integração com Riot Sign On (RSO)."

## Replit setup
- Workflow `Start application` roda `CI=1 npx expo start --web --port 5000 --host lan`. Porta 5000 é a única suportada pelo preview web.
- `CI=1` evita prompt interativo para instalar TypeScript.
- `app.json` declara `platforms: ["ios", "android", "web"]` e `web.bundler: "metro"`.
- O usuário pode escanear o QR code da barra de URL no Replit para abrir o app no Expo Go (mobile real).

## Deploy
- Configurado como deploy estático.
- Build: `npx expo export --platform web`
- Diretório público: `dist`
