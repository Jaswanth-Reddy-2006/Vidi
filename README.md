# Vidi - Premium Hand-crafted Sarees

Vidi is a modern, high-octane e-commerce platform dedicated to hand-crafted, luxury sarees. It combines rich cultural heritage with a state-of-the-art shopping experience, offering exclusive collections such as Silk, Cotton, Banarasi, and Chiffon.

## MVP Overview
This project is built to showcase a fully functional, production-ready MVP for luxury ethnic wear. It features a stunning, dynamic user interface crafted to highlight the elegance of the products, along with a robust backend architecture for catalog management and filtering.

### Key Features
- **Dynamic Hero Section**: A stunning, full-bleed card layout with overlay typography and direct calls-to-action ("Explore Collections" & "Browse Materials").
- **Intelligent Product Filtering**: Browse products with real-time URL-based sorting (Newest, Popularity, Rating, Price).
- **Seamless "Load More" Pagination**: Endless scrolling experience that fetches additional products seamlessly from the server without full page reloads.
- **Server Actions & React Server Components (RSC)**: Leverages Next.js App Router for optimal performance, ensuring rapid initial page loads and secure data fetching.
- **Responsive Design**: Flawless experience across mobile, tablet, and desktop viewports.
- **Strict Brand Theme**: Implements a strict two-color aesthetic (Dark Pink `#970747` & White `#FFFFFF`) with tasteful gold/teal/orange accents for specific calls-to-action.

## Tech Stack
- **Framework:** Next.js 16.2 (Turbopack) using the App Router
- **Language:** TypeScript
- **Database ORM:** Prisma (PostgreSQL)
- **Styling:** Tailwind CSS + custom CSS Variables
- **Icons:** Lucide React
- **Authentication:** Better Auth (Configured for future implementation)

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- PostgreSQL Database

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Vidi
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and configure your database connection:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/vidi_db"
   ```

4. **Database Migration & Seeding:**
   ```bash
   npx prisma generate
   npx prisma db push
   # Optional: run seed script if available to populate catalog
   npx prisma db seed
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The platform will be available at `http://localhost:3000`.

## Design Decisions
- **URL-driven State**: Product sorting and filtering states are driven by the URL (Search Parameters). This ensures that filtered views are perfectly shareable and fully support Server-Side Rendering (SSR).
- **Deterministic Pagination**: When using "Load More", Prisma queries utilize a deterministic tie-breaker (`id: "asc"`) to prevent identical products from appearing across multiple pages.
- **Component Architecture**: Deeply integrated UI components such as the Client-side `ProductGridClient` interacting with Server Actions (`fetchProductsAction`) strictly isolate interactive state from static HTML generation.

## Future Development
Following the MVP presentation, upcoming features will include:
- User Authentication (Better Auth) & Profile Management
- Full Shopping Cart & Checkout flow
- Admin Dashboard for Product/Inventory Management
- Review & Rating submission system

---
*Crafted with ❤️ in India.*
