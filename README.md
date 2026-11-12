# Safe on Orbit — React

Responsive institutional website for Safe on Orbit, built with React + Vite and aligned with the brand manual.

## Implemented sections

- English-first responsive navigation and mobile menu
- Hero and orbital challenge
- COSMOS platform
- Technology overview
- Global impact
- Team (four members supplied in the change request)
- Events (ready for future event entries)
- Technical and scientific papers (ready for future publications)
- Contact CTA and footer with confirmed contact channels

## Content decisions based on the change request

- Primary language: English.
- Translation priority: Arabic, Spanish, French, then Portuguese. These translations are a roadmap; the current interface is in English.
- “Founders” was replaced by “Team”.
- The “96% accuracy” claim was not carried over.
- The period was updated from 5 to 10 days. The source did not specify what this period measures, so the page labels it only as an updated planning horizon; confirm the technical meaning before publication.
- The claim “the first company exclusively dedicated to SSA” was included as supplied by the requester and should be validated by the organization before public release.
- Only confirmed contact channels are listed: safeonorbit@safeonorbit.space, LinkedIn and safeonorbit.space. No phone number or additional contact was invented.
- Events and publication sections use “coming soon” placeholders because the supplied document contains no dates, event names, papers or links.

## Brand identity

- Website colors: blue `#0094c6` and purple `#33184b`.
- Maven Pro is loaded from Google Fonts. Roti Sans Serif remains the preferred heading family in the stylesheet, but its official font file was not included in the supplied manual.
- The logo symbol is still a temporary orbit icon. Replace it with the official vector logo when available.
- Hero background uses a photographic Earth image rather than an illustrated space background.

## Run locally

Requires Node.js 20+ and npm.

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## GitHub Pages

1. Push the project files to the repository root.
2. If the project is published at `https://YOUR-USER.github.io/safe-on-orbit/`, change `base: "/"` to `base: "/safe-on-orbit/"` in `vite.config.js`.
3. Run `npm install` and `npm run deploy`.
4. Configure GitHub Pages to publish the `gh-pages` branch.

For a custom domain, keep `base: "/"` and configure the domain in GitHub Pages.
