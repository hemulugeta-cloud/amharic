# ፊደል እንማር — Fidel Temari

A learning app for Amharic Fidel (the syllabary), numbers, vocabulary, and an
introduction to Ethiopian Orthodox Tewahedo faith — built for kids, youth, and
adult new learners.

This rebuild replaces the original single 1,459-line HTML file with a small,
modular, installable web app designed to run identically on phones, tablets,
and laptops, and to be wrapped into real iOS/Android apps without rewriting
any of the learning content or game logic.

## What's actually true about "app stores"

I can't submit anything to the App Store or Play Store myself — that requires
*your* Apple Developer account ($99/year), *your* Google Play Console account
($25 one-time), and a review process only an account holder can complete.
What I *can* do, and did, is build the app the way real published apps are
built, so that step is short:

- **Right now, with no app store at all:** this is a installable PWA. Anyone
  who visits it in Chrome/Safari/Edge can tap "Add to Home Screen" and get an
  icon, offline support, and a full-screen app — no install review needed.
- **For the actual App Store / Play Store:** wrap this same code with
  [Capacitor](https://capacitorjs.com) (below). This is the standard
  industry approach used by real production apps (Ionic apps, and many
  Play Store/App Store education and productivity apps) to ship one
  HTML/CSS/JS codebase to both stores instead of writing native Swift and
  Kotlin twice.

## Project structure

```
index.html            — app shell (loads css/js, defines the screens)
manifest.json          — PWA metadata (name, icons, colors)
service-worker.js       — offline caching
capacitor.config.json  — native wrapper config (edit appId before shipping)
package.json           — Capacitor build scripts
css/style.css          — the entire design system (one file, mobile-first)
js/app.js              — router, screens, game logic
js/auth.js             — membership/session logic (see "Membership" below)
js/data-ported.js       — content carried over from the original prototype
js/data-new.js          — new content added in this rebuild
icons/                 — app icons (see "Branding" below)
```

## Running it locally

**Just double-click `index.html`.** It loads `js/app.bundle.js` — a plain
`<script>` (not an ES module) — so it works straight from your file system
with zero setup, no terminal, no server. (An earlier version of this project
used `<script type="module">`, which browsers block from loading over
`file://` for security reasons — that's why "download and open the file"
didn't work before. Fixed by bundling.)

If you *are* setting up local dev and want to edit the source instead of
the generated bundle, see "Editing the source" below.

For hosting it live (see the PWA/app-store sections further down), any
static host works — GitHub Pages, Netlify, Vercel, Firebase Hosting — since
it's just static files:

```bash
npx serve .
# or: python3 -m http.server 8080
```

## Editing the source

The real, readable source lives in `js/auth.js`, `js/data-ported.js`,
`js/data-new.js`, and `js/app.js` as ES modules — that's what to edit.
`js/app.bundle.js` is generated output (concatenated + `export`/`import`
stripped) that `index.html` actually loads, specifically so the app runs
without a server. After editing any source file, regenerate the bundle:

```bash
python3 tools/build-bundle.py
```

Do not hand-edit `js/app.bundle.js` — it'll just be overwritten next build.

## Installing as an app today (PWA — every device)

Once it's hosted anywhere with HTTPS (GitHub Pages, Netlify, Vercel, Firebase
Hosting all work and are free at this scale):

- **iPhone/iPad (Safari):** Share → Add to Home Screen.
- **Android (Chrome):** ⋮ menu → Install app / Add to Home screen.
- **Laptop (Chrome/Edge):** address bar install icon → Install.

It opens full-screen, works offline (the service worker caches the app
shell), and needs no app-store review.

## Building the real iOS and Android apps

```bash
npm install
npx cap init "Fidel Temari" "com.fideltemari.app" --web-dir .
# ⚠️ change com.fideltemari.app to a bundle ID you actually own before publishing

npm run cap:add:ios       # generates an Xcode project in ./ios
npm run cap:add:android   # generates an Android Studio project in ./android
npm run cap:sync          # copies web assets + updates native projects (rerun after any change)

npm run cap:open:ios      # opens Xcode — set your team/signing, then Archive → distribute via App Store Connect
npm run cap:open:android  # opens Android Studio — Build → Generate Signed Bundle, upload to Play Console
```

From there it's the normal store submission flow: App Store Connect listing
+ screenshots + privacy details (Xcode), or Play Console listing + Data
Safety form (Android). Both stores will ask you to fill out a **children's
privacy questionnaire** — see the next section, since it directly affects
what you can honestly answer there.

## Membership: what's real and what isn't yet

`js/auth.js` is a fully working sign-up/sign-in/session system — but it's a
**local demo provider**. Accounts, password hashes, and progress live only in
that browser's `localStorage`. Nothing is sent anywhere. This was deliberate:
it's built behind the same small interface (`signUp`, `signIn`, `signOut`,
`currentAccount`, `saveProfile`) that a real backend would expose, so making
membership production-ready means **rewriting only `auth.js`** — no screen or
game code needs to change.

### Making it production-ready

For an education app aimed partly at children, industry practice (and in the
US, the law) points to one path:

1. **Backend auth provider.** Use a managed provider rather than rolling your
   own — [Firebase Authentication](https://firebase.google.com/docs/auth) or
   [Supabase Auth](https://supabase.com/auth) are the two most common choices
   for exactly this kind of app; both have generous free tiers and handle
   password hashing, email verification, and password reset for you.
2. **Parent-owned accounts, not child accounts.** The account record already
   has a `children: []` array scaffolded for this. The pattern used by
   Duolingo Kids, Khan Academy Kids, and similar apps: a parent or teacher
   signs up with *their own* email, then adds one or more child *profiles*
   (a name and age group, no email/password of their own) under that
   account. Route learning progress to the active child profile instead of
   to the account itself.
3. **Legal/store requirements to check before launch:**
   - **COPPA** (US) — if you knowingly collect personal information from
     under-13s, you need verifiable parental consent. A parent-owned-account
     model above is the standard way apps satisfy this.
   - **Apple's Kids Category** — has its own additional review rules
     (no third-party analytics/ads without parental gates, no external
     links without a parental gate, etc.) if you opt into that category.
   - **Google Play Families Policy** — similar requirements if you target
     the Designed for Families program.
   - You don't have to target these programs — a general-audience "for
     kids and adults" app with age-neutral sign-up (like this demo's
     current flow) has a simpler compliance path, but collects less
     child-specific data as a result. Decide this before wiring a backend.
4. **Don't collect data you don't need.** The current profile only tracks
   points/streak/badges/history — no name-plus-photo, location, or contact
   list access. Keep it that way; it's both simpler and safer.

## Content: what's included

**Fidel & Numbers:** all 34 Fidel families displayed in a row with the English
sound guide under each letter (tap any letter to hear it), a full alphabet
chart view, Ethiopian numbers, days of the week, and the 13-month calendar.

**Fidel Lab Practice** (9 games): Find the Missing Letter, Word Meaning Quiz,
Multiple Choice Quiz, Complete the Word, Word Builder, Word Search,
Unscramble a Family, Order the (Base) Letters, and real canvas-based Letter
Tracing (mouse and touch).

**Picture Vocabulary:** Animals, Foods, and People categories, each with a
tap-to-hear gallery and a picture-matching game, plus a dedicated Animal
Name Scramble game.

**Bible & Faith** (10 sections): Prayers, Church Words, Feast Days, Saints,
Bible Topics, the Seven Mysteries, Church Items, a Weekly Memory Verse
(read/hide/recite), a Private Prayer Journal, a Team A vs. Team B quiz, and
a 20-question Bible & Faith Quiz. All faith content ends with an invitation
to ask a parish priest or Sunday School teacher for deeper study — these are
learning summaries, not catechesis.

Every achievement badge is earnable — tracing and the Bible quiz (the two
gaps noted in the previous version) now award their points correctly.

**Not yet ported:** the Sunday School teacher lesson-plan generator, and the
original's larger 100-question Bible quiz bank (currently 20 curated
questions — easy to extend, just add entries to `BIBLE_QUIZ_BANK` in
`js/data-new.js`).

## Design

v2 redesign: a playful "Baloo 2" display face for headings/buttons/tiles
(Inter stays for body text, Noto Sans Ethiopic for Amharic), a larger type
scale throughout for readability on the move, gradient-washed surfaces
instead of flat panels, tactile press animations on every button, a "pop"
celebration animation on correct answers, and a home-screen mascot with a
gamified points/streak/badges stats bar up top.

## Branding

`icons/` contains an open-book mark (no text, so it doesn't depend on an
Ethiopic font being installed on the icon-rendering device) in the app's
teal/gold palette, at all sizes iOS/Android/PWA expect, including a
maskable variant with safe-zone padding for Android's adaptive icon shapes.
Swap these for real artwork any time — just keep the same filenames and
sizes, or update `manifest.json` / the native icon assets Capacitor
generates.

## Design system

Everything visual lives in `css/style.css` as CSS custom properties at the
top of the file (`--brand-teal`, `--brand-gold`, `--brand-coral`, type scale,
radii, shadows). Change the look of the whole app from those ~10 lines.
Breakpoints: mobile-first, with tablet (≥768px) and laptop (≥1024px, switches
the bottom tab bar to a left side rail) refinements already in place.
