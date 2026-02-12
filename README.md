# GIBEI Forecasting Dashboard
> **AI-Driven Market Intelligence & Predictive Analytics**

GIBEI Forecasting is a state-of-the-art financial analytics platform designed for the GIBEI Research Lab at Telkom University. It leverages advanced machine learning models to provide deep-tier stock price forecasting, risk assessment, and market trend analysis through a premium, user-centric interface.

## 🚀 Key Features

-   **Interactive Predictive Charting**: High-fidelity visualization of actual vs. forecasted stock prices with confidence intervals.
-   **Bento-Grid Dashboard**: A modern, responsive layout designed for high-density information display.
-   **AI Conclusion Engine**: Automated qualitative recommendations (Strong Buy, Hold, etc.) powered by trend analysis.
-   **Real-Time Metrics**: Dynamic tracking of Volatility, Volume, and Risk Levels.
-   **Secure Authentication**: Role-based access control (RBAC) powered by NextAuth.js.
-   **Localized Intelligence**: Real-time Jakarta Time (WIB) synchronization for Indonesian market accuracy.

## 🛠️ Technology Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Database**: [Turso](https://turso.tech/) (SQLite at the Edge)
-   **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
-   **Authentication**: [NextAuth.js v5](https://authjs.dev/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Charts**: [Recharts](https://recharts.org/)

## 📦 Getting Started

### Prerequisites

-   Node.js 18+ 
-   A Turso Database instance (or local SQLite)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [repository-url]
    cd webmlgibei
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file with the following keys:
    ```env
    TURSO_DATABASE_URL=
    TURSO_AUTH_TOKEN=
    AUTH_SECRET=
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔒 Security & Privacy

-   Implemented `noindex, nofollow` meta tags for internal research privacy.
-   Strict authentication layer protecting analytical modules.
-   Secure data proxying for all external AI insights.

---

&copy; 2025-2026 GIBEI Telkom University Research Lab. All Rights Reserved.
