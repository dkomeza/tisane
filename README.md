# Tisane

Tisane is the official website for the AGH IT Future Day event. It is built with modern web technologies to provide a fast, responsive, and visually appealing experience.

## Running in Production

To run the Tisane website in production, you can use Docker Compose. Make sure to set up your `.env` file with the necessary environment variables (see `.env.example` for reference).

1. Clone the repository:

   ```bash
   git clone --depth 1 https://github.com/dkomeza/tisane.git
   cd tisane
   ```

2. Create a `.env` file based on the provided `.env.example` and fill in the required values.
3. Start the application using Docker Compose:

   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

This will start the Tisane application along with its dependencies (PostgreSQL and MinIO). The website will be accessible at `http://localhost:3000`.

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Animations:** [GSAP](https://gsap.com/), [tw-animate-css](https://github.com/ikatyang/tw-animate-css)
- **Database:** PostgreSQL with Prisma ORM

## ✨ Features

- **Modern Landing Page:** A high-performance, responsive landing page for the event.
- **Component-Based Architecture:** Modular design using React Server Components.
- **Interactive Animations:** Smooth transitions and effects using GSAP.
- **Dark/Light Mode:** Built-in theme support.

## 🔮 Future Plans: Custom CMS

We are building a bespoke CMS to manage the site's content. This will allow for:

- **Dynamic Page Building:** A block-based editor for creating custom layouts.
- **Role-Based Access Control:** Secure admin dashboard for editors and admins.
- **Media Management:** Centralized library for images and assets.
- **Theming Engine:** No-code customization of site colors and fonts.

See [roadmap.md](./roadmap.md) for the detailed development plan.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dkomeza/tisane.git
   cd tisane
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

To create a production build:

```bash
npm run build
npm start
```

## 📂 Project Structure

- `app/`: Next.js App Router pages and layouts.
- `app/sections/`: Modular components for the landing page sections.
- `components/`: Reusable UI components (buttons, inputs, etc.).
- `scripts/`: Utility scripts for project maintenance and setup.
- `public/`: Static assets.

### Adding new CMS Components

To add a new CMS component, use the provided Handlebars template located at `templates/CMSComponent.hbs`. This template ensures that all necessary parts of the component (client, admin, preview) are created consistently.

```bash
npm run generate
```

This command will prompt you for the component name, category and generate the required files in the appropriate directories. It will also update the component registry automatically.
