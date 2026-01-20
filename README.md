# Workflow Studio

Create, document, and share workflows in a single view. Capture each stage, align owners, and visualize the timeline before sending it to stakeholders.

## Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) 18.17+
- [npm](https://www.npmjs.com/)
- A modern browser

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:3000`.

## Available Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Create an optimized production build.
- `npm start`: Run the production build locally.
- `npm run lint`: Lint the project using Next.js defaults.

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout and metadata
│   ├── page.tsx        # Workflow builder interface
│   └── globals.css     # Global styles
├── public/
│   └── icon.svg        # App icon
├── next.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

## Feature Highlights

- Capture workflow steps with owners, deliverables, and hand-off notes.
- Toggle between board and timeline views instantly.
- Track total duration, active steps, and contributor spread.
- Re-order stages, advance their status, and edit entries on the fly.

## Deployment

This project is optimized for Vercel. Build and deploy with:

```bash
npm run build
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-923e01d9
```

Then verify:

```bash
curl https://agentic-923e01d9.vercel.app
```
