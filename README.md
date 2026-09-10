# Portfolio Project Readme

Welcome to My Portfolio! 

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)

## Introduction
The Project is a Portfolio built using the Vite.js framework.

## Installation
To get started with the Vite Project, follow these steps:

1. Clone the repository: `git clone https://github.com/nuzaim/portfolio.git`
2. Navigate to the project directory: `cd portfolio`
3. Install dependencies: `npm install`

## Usage
Once you have installed the dependencies, you can start using the Vite Project by running the following commands:

- Development mode: `npm run dev`
  - Starts the development server with hot module replacement (HMR) enabled.
  - Open your browser and visit `http://localhost:5173` to see the application.

- Production mode: `npm run build`
  - Builds the project for production with optimized and minified code.
  - The generated files can be found in the `dist` directory.

## Interactive workspace

Desktop opens an orbitable Three.js / React Three Fiber 8 workspace. Select the monitor (Experience), computer base or keyboard (Projects), books (Knowledge), or telephone (Contact). The persistent section links provide equivalent keyboard access. Drag to orbit, scroll or pinch to zoom, and use Reset view to return to the starting camera. Dialogs use native modal focus containment and Escape handling.

Phones below 768px start in text view without fetching the scene bundle or GLBs. Explore in 3D loads them on demand. Explicit view choices persist in session storage. Asset/WebGL failures and context loss fall back to the complete text portfolio with a retry control. Fragment links and legacy aliases work in both views.

Content lives in `src/content/portfolio.js` and `src/PortfolioContent.jsx`; fragment state is in `src/navigation.js`; rendering lives in the lazy-loaded `src/scene/Workspace.jsx`. Rendering uses demand frames, a 1.5 DPR cap, bounded OrbitControls, and no postprocessing. Hidden tabs stop rendering and reduced motion disables damping.

Model licenses, modifications, and rebuild instructions: [asset credits](public/models/CREDITS.md). Scene assets total 4.69 MB and 126,236 triangles including the floor.

## Verification

Run `npm run lint`, `npm run build`, and `npx playwright test`. First install the test browser with `npx playwright install chromium`. Browser tests cover text-first mobile loading, section dialogs, focus restoration, fragment aliases, history, session preferences, failures/retry, and responsive layouts. Playwright uses software WebGL so CI does not need a GPU. No deployment is part of this change.
