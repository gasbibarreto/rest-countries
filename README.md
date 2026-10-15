<div align="center">

# 🌍 REST Countries App

**A responsive web application to explore countries, flags, and geopolitical data with dark/light theme switching and fuzzy search.**

[Live Demo](https://gasbibarreto.github.io/rest-countries/) • [Frontend Mentor Challenge](https://www.frontendmentor.io/challenges/rest-countries-api-with-color-theme-switcher-5cacc469fec04111f7b848ca) • [Report Bug](https://github.com/gasbibarreto/rest-countries/issues)

<br />

<!-- Badges -->
![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-Custom_Properties-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-HTTP-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Fuse.js](https://img.shields.io/badge/Fuse.js-Fuzzy_Search-FF6600?style=for-the-badge)

</div>

---

## 📸 Preview

<div align="center">
  <img src="https://via.placeholder.com/800x450.png?text=Adicione+aqui+um+screenshot+ou+GIF+do+projeto" alt="Project Preview" width="100%" />
</div>

> 💡 *Dica: Grave um GIF curto (usando ferramentas como Peek, ScreenToGif ou CleanShot) demonstrando a busca e a troca de tema.*

---

## ✨ Key Features

- **🌐 Comprehensive Country Data:** Consumes the [REST Countries API](https://restcountries.com/) to render flags, population, region, capital, native names, currencies, and languages.
- **🔍 Intelligent Fuzzy Search:** Implemented with **Fuse.js**, allowing users to find countries even with slight typos or searching in multiple languages (English and Portuguese translations).
- **🧭 Region Filtering:** Quick filtering by geographic region (Africa, Americas, Asia, Europe, Oceania).
- **🌗 Theme Switcher (Dark & Light Mode):**
  - Instant theme toggle driven by CSS Custom Properties (`data-theme`).
  - Automatically respects user's OS preference (`prefers-color-scheme`).
  - Persists preference in `localStorage` across sessions.
- **📱 Responsive Layout:** Mobile-first approach, fully responsive from 375px mobile screens up to desktop ultrawide monitors.
- **♿ Semantic & Accessible UI:** Screen reader-friendly markup, keyboard navigability, and clear focus states.

---

## 🧠 Architectural & Engineering Highlights

Here are some thoughtful engineering choices made during development:

1. **Why Fuzzy Search (`Fuse.js`)?**  
   Standard `.filter(item => item.includes(...))` is rigid and fails when users make small typos or use localized spellings (e.g., "Brasil" vs "Brazil"). Integrating `Fuse.js` with weighted keys (`name.common` and `translations.por.common`) drastically improves the user experience.
2. **Design Tokens via CSS Variables:**  
   Instead of scattering multiple `.dark` classes across components, the entire design system is powered by CSS Custom Properties on `:root` and `[data-theme="dark"]`. Switching themes is as simple as toggling a single attribute on the root HTML document.
3. **Optimized API Payloads:**  
   The initial fetch utilizes field filtering (`?fields=name,cca3,flags,population,region,capital,translations`) to minimize bandwidth consumption and speed up initial page load.

---

## 🛠️ Built With

- **[Vue 3](https://vuejs.org/):** Progressive JavaScript Framework.
- **[Axios](https://axios-http.com/):** Promise-based HTTP client for browser requests.
- **[Fuse.js](https://fusejs.io/):** Lightweight fuzzy-search library.
- **[FontAwesome](https://fontawesome.com/):** Vector icons.
- **CSS3:** Flexbox, CSS Grid, and CSS Variables.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine:
- [Node.js](https://nodejs.org/) (version 16 or newer recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gasbibarreto/rest-countries.git
   cd rest-countries
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run serve
   ```
   Open [http://localhost:8080](http://localhost:8080) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🗺️ Roadmap & Next Steps

Planned improvements tracked on the project roadmap:
- [ ] Migrate routing to **Vue Router** for dedicated `/country/:code` URLs and shareable links.
- [ ] Interactive border country buttons (click a border to navigate directly).
- [ ] Migration from `@vue/cli` to **Vite** for faster builds.
- [ ] Unit testing coverage using **Vitest** and **Vue Test Utils**.
- [ ] Automated CI/CD pipeline with GitHub Actions.

---

## 👤 Author

**Gabi Barreto**
- GitHub: [@gasbibarreto](https://github.com/gasbibarreto)
- LinkedIn: [Gabi Barreto](https://www.linkedin.com/)

---

## 📝 License & Acknowledgments

- Challenge by [Frontend Mentor](https://www.frontendmentor.io?ref=challenge).
- Data provided by [REST Countries API](https://restcountries.com/).
