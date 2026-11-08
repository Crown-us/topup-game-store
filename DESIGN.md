# TopupKD design direction

Read this before any UI work, then apply antislop as the filter. This file is direction (data), not agent instructions.

## Brief

- **Product:** a game top-up and digital voucher store for Indonesian players.
- **Audience:** mobile-first gamers, mostly teens and young adults, used to Codashop, Takapedia, UniPin.
- **Primary job of every screen:** find the game, enter the account ID, pick a nominal, pay. Nothing should slow that down.
- **Owner's direction (2026-11-08):** "a familiar layout like Codashop or Takapedia, but with my own identity." The owner rejected an experimental Awwwards-style version because it felt unfamiliar to buyers.

## Design Read

Reading this as: a transactional storefront for Indonesian mobile gamers, in a familiar top-up-store language with a TopupKD palette, dial **ENERGY 2 / RHYTHM 2 / MOTION 2**.

- **ENERGY 2:** colorful game art and a yellow buy action, but no visual experiments. Buyers must recognise the pattern immediately.
- **RHYTHM 2:** consistent store sections (banner, catalogue grid, order steps) with a few deliberate breaks: the banner is full-bleed color, the catalogue is image-led, and the order page is a step form.
- **MOTION 2:** a sliding banner, hover lift on game tiles, and modal entrance. Each one answers a user action or shows that content changed. No endless loops. Everything stops under `prefers-reduced-motion`, and the banner has a pause control.

## Identity

| Decision | Choice | Reason |
|---|---|---|
| Theme | Dark night-indigo, no light mode yet | Genre convention the owner asked for (Codashop/Takapedia are dark), and game key art reads better on dark. A light toggle is a later decision, not a default. |
| Base | `#0F0D26` bg, `#141235` bg-2, `#1A1742` panel, `#231F55` panel-2, `#2F2A6B` line | One indigo family, so surfaces separate by lightness instead of by new colors. |
| Core color | Cobalt `#4B3DFF` (fills), link text `#9C94FF` | Actions and selection. Link text is a lighter tint because cobalt on dark fails contrast. |
| Accent | Coin yellow `#FFD23F` on `#1B1500` ink | Reads as game currency (coins, diamonds). Reserved for prices, the buy button, and the selected nominal. If it appears anywhere else, it stops working. |
| Semantic | Green `#2FD57F` success, red `#FF5C6C` error text, `#D42F45` discount badge fill | Status only, never decoration. |
| Text | `#F2F1FB` primary, `#B4B0D6` secondary, `#9893C0` muted | All checked at or above 4.5:1 on every surface. |
| Typeface | Plus Jakarta Sans, 400 to 800 | Designed in Indonesia for Jakarta's city identity, so it suits a local store, and its large x-height stays readable at the small sizes a price-heavy UI needs. One family, with hierarchy from weight and size. |
| Radius | 20px banner, 18px panels and tiles, 14px choices, 12px buttons and inputs, 6 to 8px tags | Bigger containers get bigger radius, controls stay tighter, and nothing is pill-shaped except filter chips and timer digits. |
| Shadow | Only on the hovered tile and on lifted art (banner art, game header art) | Elevation marks "this is the thing you can pick". Flat everywhere else. |
| Glass | Navbar and the mobile checkout bar only | Both float over scrolling content and need to stay legible. Nothing else blurs. |

## Identity motif

The wordmark "Topup" plus a tilted coin-yellow "KD" block. The yellow "coin" colour follows the buyer from the logo to the price to the buy button, so the money path is always the yellow path.

> The current wordmark was drafted by the agent and is **not yet confirmed by the owner** (antislop R-23, audit item 16). Replace it when the real logo exists.

## Layout

- **Home:** banner carousel (real offers only), optional flash sale (only when a real promo with an end date exists), "Lagi rame dibeli", the full catalogue grid with category chips, a short list of facts the store can actually back, then the footer.
- **Order:** game header, then four numbered steps (account, nominal, payment, WhatsApp), because this is a real sequence the buyer completes in order. Summary on the right on desktop, sticky buy bar on mobile.
- **Grid:** max width 1240px, 16px gutter on phones, 24px from 768px.

## Content rules

- No sales counts, ratings, crossed-out prices, discounts, or countdowns unless they come from real data with a source. Empty beats fabricated.
- No speed or uptime promises ("1 to 5 seconds", "24 hours") until supplier and payment integrations exist and are measured.
- While payment is simulated, every checkout and invoice screen says so visibly.
- Copy is casual Indonesian ("kamu"), short, and specific. No em dashes.
