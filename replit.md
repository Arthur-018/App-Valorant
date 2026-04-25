# Valorant App Completo Final

An Expo + Expo Router project displaying Valorant data (agents, weapons, skins, maps, etc.) consumed from the public `valorant-api.com` API.

## Stack
- Expo SDK 51
- Expo Router 3 (file-based routing in `app/`)
- React Native 0.74 + React Native Web 0.19 for the web build
- React 18.2

## Project Structure
- `app/` — Expo Router screens (login, cadastro, home, category, detalhe, agent-detail, weapon-detail, weapon-skins, maps)
- `components/` — Reusable UI (BackButton, Button, Home, MenuCard, RoleCard, ValorantCard)
- `services/` — `valorantApi.js` (fetch helpers) and `helpers.js` (object utilities)
- `data/categories.js` — Static list of categories shown on the home screen
- `assets/`, `constants/`, `hooks/` — Standard Expo project folders

## Replit Setup
- The single `Start application` workflow runs `CI=1 npx expo start --web --port 5000 --host lan`, exposing the web build on port 5000 (the only port supported by the Replit web preview).
- `CI=1` keeps Metro from prompting interactively for missing TypeScript packages.
- `app.json` declares `platforms: ["ios", "android", "web"]` and `web.bundler: "metro"` so Expo Router can produce a web bundle.

## Deployment
- Configured as a static deployment.
- Build command: `npx expo export --platform web`
- Publish directory: `dist`
