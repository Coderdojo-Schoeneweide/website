# CoderDojo Schöneweide Website

Welcome to the codebase for the **CoderDojo Schöneweide** website!  
This project is built using [Astro](https://astro.build/), a modern frontend framework optimized for fast, content-rich websites.

We are currently in the process of **redesigning the site** based on a new visual direction.  
Designs and prototypes have been created in Figma and are available to all team members (see below).

---

## 🚀 Getting Started

To run this project locally:

```bash
# Clone the repository
git clone https://github.com/majdkt/coderDojo.git
cd coderDojo

# Install dependencies
npm install

# Start the development server
npm run dev
```

The site will be available at `http://localhost:4321/`

Astro uses file-based routing. Pages live inside the `src/pages/` directory. Components and layouts can be found in `src/components/` and `src/layouts/`.

---

## 🧠 Project Overview

The website is built using an Astro template, customized to fit the needs of CoderDojo Schöneweide.

We're in the middle of redesigning the website with a fresh look and improved UX. The development work should follow the structure of the new Figma design as closely as possible.

---

## 🎨 Figma Design Prototypes

All design guidelines, component layouts, and page flows (mobile + desktop) are documented here:

👉 [**Figma Project – CoderDojo Schöneweide**](https://www.figma.com/design/i35OpeDynTMuvSdyxRITlV/Coderdojo-Sch%C3%B6neweide?node-id=0-1&t=DUM0hQqKa6J32GqP-1)

Please use this as the single source of truth when implementing features or pages.

If you’re not already added to the project, ask the team to invite you.

---

## 🤝 Contributing

1. Fork the repository or create a new branch from `main`.
2. Make your changes, following the design specs in Figma.
3. Submit a pull request with a short description of what you’ve built or improved.

Let’s keep the code clean, accessible, and easy to maintain!

### How to develop locally

If you want to be able to view a local preview of the website you need to install the required dependencies:

```bash
npm ci
```

- Clone this repository: git clone <https://github.com/Coderdojo-Schoeneweide/website.git>
- Create a new git branch for developing your feature: git checkout -b <branch_name> (exceptions only for hotfixes!)
- Run `npm run dev` from within the root directory to run a local server serving the website. Astro supports live-reloading, so you don't need to restart the server each time you change something.
- Implement and commit your changes: `git commit -a -m "<put commit message here>"`
- Push to the GitHub repository: `git push -u origin <branch_name>` (or simply `git push` if you've pushed to the branch before)
- Open a pull request for your changes to be merged into master and go live!

---

## 📫 Contact

If you have any questions about the setup, design implementation, or contribution process, feel free to reach out to the project maintainer.

---

Thanks for being part of the CoderDojo Schöneweide team! 💻🎨🚀
