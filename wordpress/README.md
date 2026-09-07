# KURITA BOOTH GLOBAL — WordPress Theme

Custom WordPress theme that ports the approved static design (navy/red,
Inter typeface, card-based system) 1:1 into an editable, WordPress-managed
site. No page builder, no ACF/paid plugins — everything is native
WordPress (Custom Post Types, hand-written meta boxes, native Gutenberg
blocks) so there is zero recurring license cost and no vendor lock-in.

## What's in this folder

```
wordpress/
├── theme/kurita-booth-global/        the theme — install this
├── content-export/kurita-booth-global-sample-content.xml   sample content (WXR)
├── kurita-booth-global-theme.zip      the theme, already zipped for upload
└── README.md                          this file
```

## 1. Installation

1. **WordPress core**: use any current WordPress install (5.9+; developed
   against 6.4 APIs, forward-compatible). PHP 7.4+, MySQL/MariaDB.
2. **Upload the theme**: wp-admin → Appearance → Themes → Add New → Upload
   Theme → select `kurita-booth-global-theme.zip` → Install → Activate.
   (Or unzip `theme/kurita-booth-global/` directly into
   `wp-content/themes/` over SFTP.)
3. **Permalinks**: Settings → Permalinks → choose "Post name" → Save
   (required for `/max-series/`, `/site-survey/`, etc. to work).
4. **Import sample content** (optional but recommended — gives you the 5
   MAX products, 6 case studies, 6 "Which MAX" rules and all 10 pages
   pre-built, in English): Tools → Import → WordPress → upload
   `content-export/kurita-booth-global-sample-content.xml` → assign
   authors → check "Download and import file attachments" → Run Importer.
5. **Set the front page**: Settings → Reading → "A static page" → Homepage
   = **Home** (the importer creates it, but WordPress doesn't
   auto-assign it as the front page).
6. **Set up the primary menu**: Appearance → Menus → create a menu, add
   the 9 pages, assign it to the **Primary Navigation** location (until
   you do this, the header shows a safe fallback with the same 9 links,
   so the site never looks broken).
7. Recommended plugins (both free, install from Plugins → Add New):
   - **Polylang** — for the English/Vietnamese content. See section 5.
   - **Rank Math** or **Yoast SEO** — the theme has a minimal built-in SEO
     title/description field per page, and steps aside automatically the
     moment one of these is active.

## 2. Content model

| WordPress screen | What it controls |
|---|---|
| **Pages** | The 10 site pages (Home, Why KURITA MAX, MAX Series, Which MAX, Engineering, Applications, Case Studies, About, Site Survey, Contact). Each page's body is a *sequence of blocks* — see §3. |
| **MAX Series** | The 5 products (Eco Max, Max Convert Advance, Max Convert Advance Wide, View Max, G-Max). Add a 6th any time — it appears automatically on the MAX Series grid and compare table. |
| **MAX Series → Which MAX Rules** | The "What problem are you trying to solve?" table that drives the interactive selector on Home and the Which MAX page. |
| **Case Studies** | Add/edit/publish/unpublish case studies. They appear automatically wherever a Case Studies Grid block is placed. |
| **Brochures** | PDF files + a download button label. Link one to a MAX product from that product's edit screen. |
| **Site Settings** (bottom of the left sidebar) | The handful of strings that repeat on every page: top announcement bar, footer description/disclaimer, contact details. |

None of these require touching HTML/PHP/CSS/JS for normal editing.

## 3. Editing a page's sections

Every page is built from a **sequence of custom blocks** in the normal
Gutenberg editor — open any page and you'll see blocks named "Hero", "Icon
Card Grid", "MAX Series Grid", "CTA Banner", etc., one per visual section.

- **Reorder a section**: click the block, use the up/down arrows (or drag
  the ⠿ handle) in the toolbar.
- **Remove a section**: click the block → the "⋮" menu → Remove Block.
- **Add a section**: click "+", search "KURITA" to see only this site's
  section blocks (they're grouped under the "KURITA Sections" category),
  pick one, fill in its fields in the right-hand panel.
- **Edit a section's text/image**: select the block — its fields appear in
  the right sidebar (heading, text, image, buttons, cards...). The
  preview below the fields updates live and always matches the real site
  exactly (it's rendered by the same PHP that renders the live page).
- **Layout options are intentionally limited** to what's safe for this
  design (columns, background shade, media left/right, orientation) —
  by design, there's no font/color/spacing freedom that could break the
  visual system. That control is deliberate, per the project brief.

MAX Series Grid, Compare Table, Case Studies Grid and Choose Your MAX
blocks don't have content fields for the items themselves — they pull
live from MAX Series / Case Studies / Which MAX Rules automatically.

## 4. Images, PDFs, SEO

- Upload any size image — the theme registers fixed crop sizes for every
  slot (hero, product card, case card, brochure cover) so a mismatched
  upload can't distort a grid or break the responsive layout.
- Always fill in the image's **Alt Text** in the Media Library — that's
  what makes it accessible/SEO-friendly; the theme doesn't hardcode alt
  text anywhere.
- Brochure PDFs: Brochures → Add New → Select PDF → set the download
  button label → Publish, then link it from the relevant MAX product.
- SEO fields (title override, meta description) appear as a box near the
  bottom of each Page/MAX Series/Case Study editor, unless Rank Math or
  Yoast is active (then their box replaces it — nothing to reconfigure).

## 5. English + Vietnamese (Polylang)

This dev/build sandbox had no internet access to wordpress.org, so
Polylang could not be installed or exercised here — that is a one-time,
two-minute step on your real hosting (which has normal internet access):

1. Plugins → Add New → search "Polylang" → Install → Activate.
2. Languages → Languages: add **English** (set as default) and
   **Vietnamese**.
3. Set the URL format to "Directory" so languages resolve at `/en/` and
   `/vi/` (Languages → Settings → URL modifications).
4. Every screen this theme registers (Pages, MAX Series, Case Studies,
   Brochures, Which MAX Rules) is already marked translatable — no
   extra configuration needed there.
5. For each existing English item, click the "+" in the Languages column
   (Pages list, MAX Series list, etc.) to create its Vietnamese
   translation, then paste in the Vietnamese copy — see the companion
   **Admin Guide** for the full Vietnamese text for every page, product
   and case study, ready to paste in field-by-field.
6. The header's EN/VI pill automatically becomes a real Polylang language
   switcher once the plugin is active (it degrades to a static "EN" badge
   before that, so the site never shows a broken control).
7. Thai/Indonesian/Malay later: repeat step 2 for each language — no
   theme changes needed, per the brief's phase 2 plan.

## 6. For developers — architecture notes

- **No build step.** All block editor JS is hand-written against
  `wp.blocks` / `wp.element` / `wp.blockEditor` globals (no JSX, no
  webpack). `blocks/_shared-deps.php` hand-declares each block's script
  dependencies (normally auto-generated by `@wordpress/scripts`).
- **Every block is a dynamic block**: `render.php` is the only source of
  truth for markup (used on both the live site and, via
  `<ServerSideRender>`, the editor preview) — there is no separate
  `save()` markup to keep in sync.
- **CPTs and meta boxes are hand-coded** (`inc/cpt-*.php`,
  `inc/meta-boxes-*.php`) — no ACF. Repeatable fields (features, specs,
  gallery) use a small vanilla-JS "clone row" helper
  (`assets/js/admin-meta.js`), the entire homemade equivalent of an ACF
  Repeater field.
- **`kbg_site_survey_url()` / `kbg_contact_url()`** resolve by page slug
  (`site-survey`, `contact`) with a Site Settings fallback — keep those
  slugs if you rename the pages' titles.
- **`max_series` and `case_study` archives are disabled on purpose**
  (`has_archive => false`) because the *listing* pages live at
  `/max-series/` and `/case-studies/` as regular editable Pages (built
  from `kbg/max-series-grid` / `kbg/case-studies-grid`), which would
  otherwise collide with the CPT's own archive URL. Single items live at
  `/max-series-product/<slug>/` and `/case-study-item/<slug>/`.
- **Known simplification**: the original static design's centered
  "principle quote" callout (About page) is approximated with a
  single-step vertical `kbg/funnel-steps` block rather than a dedicated
  block, to keep the block library to a manageable, well-tested set. Purely
  cosmetic — content-wise identical.
- To add a new section type: duplicate any folder under `blocks/`,
  rename the block in `block.json`, adjust `render.php`'s markup and
  `edit.js`'s fields. It's auto-registered — nothing else to wire up.
