# RouteFlow architecture

## Current boundary

RouteFlow currently uses one Next.js App Router application. React Server Components remain the default; client components are used only for local interface interactions. This keeps the first delivery small while leaving a clear path to Next.js route handlers, PostgreSQL, and background synchronization.

## Source responsibilities

- `src/app`: routes, metadata, error boundaries, and global design tokens
- `src/components`: reusable interactive application shells and feature views
- `src/lib`: typed domain data, formatting, validation, and future server-only services
- `public`: versioned static assets only

## Planned full-stack boundaries

The next backend phase should introduce these server-only layers without leaking database access into client components:

1. Route handlers or server actions validate every request.
2. Authentication resolves company and employee identity.
3. Authorization policies enforce one of OWNER, SALESPERSON, WAREHOUSE_MANAGER, or DELIVERY_EXECUTIVE.
4. Service functions implement workflow transitions and database transactions.
5. Repository functions scope every business query by `companyId`.
6. PostgreSQL remains the authoritative data source.

Prisma, authentication, and offline synchronization have not been added yet because the active scope is Next.js foundation only.

## Interface principles

- English-only labels and validation
- Deep-blue, high-contrast Material-inspired design
- Minimum 44 px primary touch targets
- Responsive behavior from 320 to 480 px and larger desktops
- One obvious primary action per area
- Plain cards and borders: no gradients or glassmorphism
- Operational terms such as “Order,” never shopping-cart language
