# Portafolio Angular - Zen Minimalist Edition 🌿

[![Angular](https://img.shields.io/badge/Angular-21.0.0-DD0031.svg?style=flat&logo=angular)](https://angular.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> **"Simplicity is the ultimate sophistication."**

This is a modern, high-performance portfolio application built with **Angular 21** and **Tailwind CSS 4**. It embodies a "Zen Minimalist" design philosophy, focusing on clean lines, meaningful whitespace, and a distraction-free user experience.

The codebase is structured following **Atomic Design** principles, ensuring modularity, scalability, and maintainability.

---

## ✨ Features

- **🚀 Modern Stack**: Built on the bleeding edge with **Angular 21** and **Tailwind CSS 4**.
- **🧩 Atomic Design Architecture**: Components organized into Atoms, Molecules, and Organisms for true reusability.
- **🧘 Zen Aesthetics**: Custom "Zen" styling with subtle grid backgrounds (`.zen-grid-bg`), smooth animations, and a focus on content.
- **📱 Fully Responsive**: Adaptable layouts that look great on any device.
- **⚡ High Performance**: Optimized build with tree-shaking and lazy loading.

---

## 🏗️ Project Structure

The project follows a strict directory structure to maintain order and scalability:

```
src/app/
├── core/           # Core services, guards, and singleton providers
├── layouts/        # Main layout definitions
├── pages/          # Route-level components (Views)
│   └── home/       # Landing page
├── shared/         # Reusable code
│   ├── atoms/      # Basic building blocks (Buttons, Inputs, Icons)
│   ├── molecules/  # Simple combinations (Nav items, Cards)
│   └── organisms/  # Complex sections (Hero, Footer, Navbar)
└── app.routes.ts   # Application routing configuration
```

## 🎨 Design System

The application uses a custom design system tokenized via Tailwind CSS.

- **Typography**: Clean sans-serif fonts optimized for readability.
- **Colors**: A minimal palette with semantic intent.
- **Animations**: Purposeful micro-interactions (fade-ins, slide-downs, hover states).
- **Grid**: A subtle background grid (`.zen-grid-bg`) adds depth without clutter.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.13.0 or higher.
- **npm**: v9.0.0 or higher.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/portafolio-angular.git
    cd portafolio-angular
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Development Server

Run the development server and open functionality in your browser:

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Build the project for production:

```bash
npm run build
# or
ng build
```

The build artifacts will be stored in the `dist/` directory.

---

## 🧪 Testing

### Unit Tests

Execute unit tests via [Vitest](https://vitest.dev/):

```bash
npm test
# or
ng test
```

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or bug fixes, feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
