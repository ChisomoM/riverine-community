# Project Instructions

## Project Overview
- **App**: Riverine Community Church, a mobile-first PWA demo (frontend only, no backend yet).
- **Stack**: React 19, TypeScript, Vite, Tailwind CSS 3, `react-router-dom` v7, `lucide-react`.
- **Package Manager**: `pnpm`.

## Structure
- `src/pages`: one file per screen (Home, EventDetail, Give, GivingHistory, Join, Me, Admin).
- `src/components/ui`: small shared pieces (Button, Chip, Field, Toggle, Toast, Pill).
- `src/components/layout`: `Screen` and the bottom tab bar.
- `src/data`: types, seed data and the localStorage-backed demo store.
- `src/repos`: the only place screens read or write data (`EventsRepo`, `MembersRepo`, `GivingRepo`, `SettingsRepo`). Swap these for API calls later without touching screens.

## Styling
- Design tokens are CSS variables in `src/index.css` (light and `data-theme="dark"`), exposed to Tailwind in `tailwind.config.js`.
- Fonts: Cinzel for headings, Montserrat for UI, Lora for reading text.
- Touch targets are at least 44px.
