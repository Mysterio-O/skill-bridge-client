# SkillBridge

A modern, full-featured skill-sharing platform that connects tutors with students. SkillBridge enables users to discover qualified tutors, book sessions, manage schedules, and facilitate knowledge transfer through a comprehensive web application.

---

## � Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Development Workflow](#development-workflow)
- [Building & Deployment](#building--deployment)
- [Role-Based Access Control](#role-based-access-control)
- [API Integration](#api-integration)
- [Contributing Guide](#contributing-guide)
- [Troubleshooting](#troubleshooting)

---

## � Overview

SkillBridge is a Next.js-based skill-sharing marketplace designed to streamline the process of connecting learners with expert tutors. The platform provides role-based interfaces for three distinct user types:

- **Students**: Discover tutors, book sessions, and track learning progress
- **Tutors**: Manage availability, handle bookings, and build their teaching profile
- **Admins**: Oversee platform operations, manage users, and review tutor applications

The application is built with modern React patterns, TypeScript for type safety, and integrates with a backend API for data persistence and business logic.

---

## ✨ Key Features

### For Students

- **Tutor Discovery**: Browse and search available tutors with filters and detailed profiles
- **Booking Management**: Schedule sessions with preferred tutors with flexible time slots
- **Session Tracking**: View upcoming, completed, and cancelled sessions
- **Ratings & Reviews**: Leave feedback and ratings for tutoring sessions
- **Dashboard**: Quick overview of bookings, completion status, and learning progress
- **Profile Management**: Update personal information and learning preferences

### For Tutors

- **Profile Management**: Create and maintain a comprehensive teaching profile
- **Availability Management**: Set hourly rates, availability windows, and specializations
- **Session Management**: Accept/reject bookings and manage your schedule
- **Rating System**: Build reputation through student reviews and ratings
- **Dashboard Analytics**: Track sessions, revenue, and performance metrics
- **Tutor Application Process**: Apply to become a tutor and get verified by admins

### For Administrators

- **User Management**: Monitor and manage all platform users
- **Application Review**: Review and approve/reject tutor applications
- **Booking Oversight**: Track all platform bookings and manage disputes
- **Platform Analytics**: View comprehensive statistics on users, tutors, bookings, and reviews
- **System Settings**: Configure platform-wide settings and policies
- **Dashboard**: Quick analytics on active users, pending applications, and recent bookings

### General Features

- **Authentication & Authorization**: Secure JWT-based authentication with role-based access control
- **Email Verification**: Account security through email verification process
- **Dark/Light Theme**: Full theme support with automatic preference detection
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Form Validation**: Client and server-side form validation with Zod

---

## �️ Architecture

### System Design

The frontend is built as a Next.js 16 application that proxies requests to a backend API, maintaining separation of concerns and enabling independent scaling.

**Key Components:**
- **Next.js App Router**: File-based routing with layout groups for code organization
- **React Context**: AuthProvider for session management and user state
- **Server Actions**: Data fetching with authentication headers
- **API Proxy Routes**: Next.js API routes that forward requests to backend with proper headers
- **Tailwind CSS + Radix UI**: Component-based styling and accessible UI primitives

### Authentication Flow

1. User submits email/password on login or registration page
2. Request sent to backend  endpoint
3. Backend validates credentials and returns JWT token
4. Token stored in HTTP-only cookie () and accessible cookie ()
5. AuthProvider manages session state and user context
6. Protected routes verify authentication via middleware and context
7. Token automatically attached to requests via  utility

### Page Organization (File-based Routing)

Routes are organized in directory groups for better code organization:

-  - Public marketing pages (home, tutor listing)
-  - Authentication pages (login, register, email verification)
-  - Admin dashboard and management pages
-  - Tutor-specific pages (dashboard, bookings, settings)
-  - Student-specific pages (dashboard, bookings, settings)
-  - Additional private routes (become tutor, etc.)

---

## �️ Tech Stack

### Frontend

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16.1.6 (App Router) |
| **Language** | TypeScript 5 |
| **React** | React 19.2.3 |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | Radix UI |
| **Forms** | React Hook Form + Zod |
| **Icons** | Lucide React |
| **Theme** | next-themes |
| **Date Handling** | date-fns |
| **Utilities** | clsx, tailwind-merge |

### Development Tools

| Tool | Purpose |
|------|---------|
| **TypeScript** | Type Safety |
| **ESLint** | Code Quality |
| **Tailwind PostCSS** | Styling Processing |
| **tw-animate-css** | Animations |

### Backend Integration

- Custom API proxy routes in 
- Server Actions for data fetching ()
- JWT token-based authentication
- Cookie-based session management

---

## � Project Structure

The project follows a well-organized structure using Next.js App Router with layout groups:

**Key Directories:**
-  - Public pages (Home, Tutor Discovery)
-  - Authentication pages (Login, Register, Email Verification)
-  - Admin dashboard and management panels
-  - Tutor-specific dashboards and settings
-  - Student dashboards and booking management
-  - Reusable React components organized by feature
-  - Utility functions, authentication, RBAC configuration
-  - TypeScript type definitions

See the detailed structure in the [Full Project Structure](#full-project-structure) section of this README.

---

## � Installation & Setup

### Prerequisites

- **Node.js**: Version 18.17 or higher
- **npm** or **yarn**: Package manager
- **Git**: Version control
- **Backend API**: Running backend server (separate repository)

### Step-by-Step Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Mysterio-O/skill-bridge-client.git
cd skillbridge
```

#### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

#### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### 4. Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

#### 5. Verify Installation

- Open http://localhost:3000 in your browser
- You should see the SkillBridge home page
- Click Login or Register to test authentication
- Check browser console for any errors

---

## ⚙️ Environment Configuration

Create `.env.local` in the project root:

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Frontend URL (for redirects and email links)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important**: Never commit `.env.local` to version control. Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

---

## � Development Workflow

### Running the Development Server

```bash
npm run dev
```

### Code Standards

- **TypeScript**: Use strict mode, type all functions
- **Components**: PascalCase names, functional components with hooks
- **Linting**: Run `npm run lint` before committing
- **Formatting**: Prettier configured via ESLint

### Creating New Features

1. **Add types** in `/src/types`
2. **Create components** in `/src/components`
3. **Add pages** in `/src/app/<layout>`
4. **Update navigation** in `/src/lib/rbac.ts`
5. **Test thoroughly** across all roles

---

## �️ Building & Deployment

### Local Build

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Using Docker

```bash
docker build -t skillbridge .
docker run -p 3000:3000 -e NEXT_PUBLIC_BACKEND_URL=<url> skillbridge
```

---

## � Role-Based Access Control

### User Roles

**Student** ()
- Browse tutors
- Book sessions
- Rate tutors

**Tutor** ()
- Create teaching profile
- Manage bookings
- Track ratings

**Admin** ()
- Manage users
- Review tutor applications
- View analytics

---

## � API Integration

### API Endpoints

| Route | Purpose |
|-------|---------|
|  | Authentication |
|  | Tutor listings |
|  | Booking management |
|  | Admin operations |

### Making API Requests

```typescript
import fetcher from @/lib/fetcher;

const data = await fetcher(/api/tutors?page=1);
```

---

## � Contributing Guide

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes following code standards
4. Test thoroughly
5. Commit: `git commit -m feat: add new feature`
6. Push: `git push origin feature/your-feature`

### Code Review Checklist

- [ ] TypeScript types properly defined
- [ ] No console errors
- [ ] Responsive design works
- [ ] Error handling implemented
- [ ] Documentation added

---

## � Troubleshooting

### Cannot find module errors
```bash
npm install
rm -rf .next
npm run dev
```

### Authentication not working
- Verify `NEXT_PUBLIC_BACKEND_URL` in `.env.local`
- Check backend API is running
- Clear browser cookies
- Check browser console for errors

### Styles not applied
```bash
rm -rf .next
npm run dev
```

---

## � Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com)

---

## � License

This project is part of an assignment.

---

**Last Updated**: February 2026  
**Version**: 1.0.0  
**Status**: Active Development

---

## Full Project Structure

```
skillbridge/
├── public/
├── src/
│   ├── app/
│   │   ├── (admin)/               # Admin pages
│   │   ├── (auth)/                # Login, Register, Email Verification
│   │   ├── (student)/             # Student dashboard and pages
│   │   ├── (tutor)/               # Tutor dashboard and pages
│   │   ├── (public)/              # Home page, tutors listing
│   │   ├── (private)/             # Become tutor form
│   │   ├── api/                   # API proxy routes
│   │   ├── actions/               # Server Actions
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── auth/                  # Auth components
│   │   ├── dashboard/             # Dashboard components
│   │   ├── marketing/             # Home page components
│   │   ├── shared/                # Layout and shared components
│   │   ├── ui/                    # UI primitives (Radix)
│   │   └── ErrorBoundary.tsx
│   ├── providers/
│   │   ├── AuthProvider.tsx
│   │   └── ThemeProvider.tsx
│   ├── lib/
│   │   ├── auth/
│   │   ├── rbac.ts
│   │   ├── fetcher.ts
│   │   └── utils.ts
│   ├── types/
│   │   ├── auth.types.ts
│   │   └── dashboard.ts
│   └── hooks/
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

