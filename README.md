# Bittensor Technical Assessment

This repo contains code for the Bittensor Technical Assessment.
See the application at https://bittensor-technical-assessment.vercel.app/

**Note:** this repo will be deprecated as of Jan 28, 2024, as I will be removing the paid CoinGecko API license at that time.

## Objectives

My objectives for this assessment are to:

1. Create a dashboard that displays fiat prices for 15 cryptocurrencies in real time - matching the design provided
2. Style the dashboard to be responsive
3. Design the dashboard with accessibility in mind, so it is easily usable by visually-impaired and/or keyboard users
4. Integrate analytics
5. Employ SEO best practices (including server-side rendering)
6. Do it all in 2 days of work (or less)!

## Technology Highlights

- Svelte 5 (SvelteKit): extremely lightweight and performant (not requiring a browser runtime, unlike React or Vue) and a joy to use
- Tailwind: allows for rapid prototyping and easy styling
- Sass: allows for easy styling when Tailwind is not enough
- GoatCounter: simple, privacy-focused analytics (https://ezra-bittensor-assessment.goatcounter.com/)
- Bun: very speedy package manager (though I will also include instructions for npm/yarn)
- Highcharts: powerful, flexible, accessible charting library (using a free Personal License obtained for this project)
- CoinGecko API: API for cryptocurrency data (using a paid license)

## How to set up the repo

1. Clone the repo, `git clone git@github.com:ezra-sg/bittensor-technical-assessment.git`
2. `cd` into the repo, `cd bittensor-technical-assessment`
3. Install dependencies:
    - Using bun: `bun install`
    - Using npm: `npm install`
    - Using yarn: `yarn install`

## How to run

1. Run the dev server:
    - Using bun: `bun dev`
    - Using npm: `npm run dev`
    - Using yarn: `yarn dev`
2. Open the app in your browser at `http://localhost:5173/`

## How to build

1. Run the build script:
    - Using bun: `bun build`
    - Using npm: `npm run build`
    - Using yarn: `yarn build`
