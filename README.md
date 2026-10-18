# Riverine Community Church

A mobile-first PWA demo for Riverine Community Church. It is frontend only: every screen runs on realistic seed data kept in `localStorage`, so leadership can walk one member journey on a phone, from joining to giving.

## What's in the demo

| Screen | What it shows |
| --- | --- |
| Home | Verse of the day, quick links, featured men's retreat with RSVP, ministry-filtered "What's on" feed |
| Event detail | Places taken, programme, add to calendar (.ics), RSVP, retreat appeal that links to the give flow |
| Give | Category, amount, MTN/Airtel, simulated prompt, pending, success and failed states, receipt |
| Giving history | Yearly summary, per-category split, filters, grouped by month, statement via the print dialog |
| Join | Four-step membership form with validation, a saved draft, and a pending approval screen |
| Me | Profile and giving summary (unlocked once approved), appearance, large text, install prompt |
| Admin | Approve join requests, post an announcement to the Home feed, attendance trend chart |

Teachings and Services appear in the tab bar as "coming soon" placeholders.

## Demo walkthrough

1. Open **Me** and set **View as** to **Visitor**, then **Start membership** and fill the form. Close the tab midway and come back: the draft is restored.
2. Send the request. On the pending screen choose **Demo · Open admin to approve** (or switch on **Church office (admin)** in Me).
3. In **Admin > Members** tap **Approve**. **Me** now shows the profile and giving history.
4. In **Admin > Post** publish an announcement and see it on **Home**.
5. Open the men's retreat, tap **Give to the retreat fund**, and give. Turn on **Simulate a failed payment** to show the error path.
6. **Me > Reset demo data** restores the seed between runs. The demo runs on a fixed date (Sunday 18 October 2026).

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # type-check and production build
pnpm preview    # serve the build; the service worker only runs here
pnpm lint
```

## Structure

```
src/
  pages/              one file per screen
  components/ui/      Button, Chip, Field, Pill, Switch, Toast, ...
  components/layout/  Screen, BottomNav, TopBar
  data/               types, seed data, localStorage store
  repos/              EventsRepo, MembersRepo, GivingRepo, SettingsRepo
  lib/                formatting, event helpers, install prompt
public/               manifest, service worker, icons
```

Screens only talk to `src/repos`. When the Go API exists, replace the repo internals (and make them async) without touching the pages.

## Styling

Design tokens are CSS variables in `src/index.css` with a dark theme under `data-theme="dark"`, exposed to Tailwind in `tailwind.config.js`. Cinzel is used for headings, Montserrat for UI and Lora for reading text.
