# Riyazat Jaffar Kazarani - Interactive 3D Portfolio

An immersive, premium 3D perspective developer portfolio website for **Riyazat Jaffar Kazarani**, bridging Salesforce Development, UI/UX Design, and Web Development.

## 🚀 Features

- **Immersive 3D Scroll Scene**: A linear-depth perspective scrolling experience (similar to visionOS/Linear aesthetics) that translates sections dynamically on the Z-axis.
- **Micro-Animations & Mouse-Tilt**: Interactive mouse-coordinate tilt effects on visual elements.
- **A11y/WCAG Compliance**: Full accessibility support with appropriate ARIA roles, keybaord navigation, and reduced-motion fallback.
- **Dual Theme Support**: Light and Dark mode with automatic system detection.
- **Print Layout**: Automatic transformation into a clean, flat 2D resume grid when printing or saving as PDF.
- **Fast Static Hosting**: Engineered to run on Cloudflare's global network using Cloudflare Workers Assets.

## 📂 Project Structure

```text
├── public/
│   ├── assets/          # Favicon and media assets
│   ├── index.html       # Portfolio HTML structure & semantic markup
│   ├── script.js        # Scroll-coordination & UI interactivity
│   └── style.css        # Premium typography, variables, & 3D styling
├── README.md            # Project documentation
├── package.json         # Development scripts
└── wrangler.toml        # Cloudflare Wrangler deployment configuration
```

## 💻 Local Development

1. Install local dependencies (uses `serve` to serve the static folder):
   ```bash
   bun install
   # or
   npm install
   ```

2. Start the local development server:
   ```bash
   bun run dev
   # or
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000` (or the port specified by the console).

## ☁️ Cloudflare Deployment

The project is configured to deploy static assets from the `public/` directory to Cloudflare Workers.

### Configuration (`wrangler.toml`)
```toml
name = "rjkriyaz"
compatibility_date = "2026-05-24"

[assets]
directory = "public"
```

### Build & Deployment Settings on Cloudflare Dashboard:
- **Build Command**: (Leave blank or set to `echo "No build step required"`)
- **Deploy Command**: `npx wrangler deploy`
- **Root Directory**: `/`
