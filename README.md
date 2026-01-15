# GymPro - Gym Management System

A comprehensive, full-stack web application designed to streamline gym operations, manage members, track payments, and organize store inventory and diet plans. Built with **Next.js 14**, **TypeScript**, **MongoDB**, and **Tailwind CSS**.

## 🚀 Features

### 🔐 Authentication & Roles
*   **Secure Sign Up/Login**: JWT-based authentication with secure password hashing.
*   **Role-Based Access Control (RBAC)**:
    *   **Admin**: Full system access.
    *   **Member**: Access to personal dashboard, profile, and store.
    *   **User**: Default role for new signups (pending member upgrade).
*   **Smart Setup**: The first registered user is automatically assigned the **Admin** role.

### 👑 Admin Module
*   **Dashboard**: Real-time overview of active members, monthly revenue, pending payments, and recent registrations.
*   **Member Management**:
    *   Add new members with specific Fee Packages.
    *   List, Search, Edit, and Delete members.
    *   Track membership status (Active, Inactive, Expired).
*   **Fee & Payment Management**:
    *   Create and manage Fee Packages (e.g., "Monthly Gold", "Yearly Platinum").
    *   Record payments for memberships or store purchases.
    *   Support for multiple payment methods (Cash, UPI, Card).
*   **Store Inventory**:
    *   Manage Supplements and Gym Products (Add, Update, Track Stock).
*   **Diet Planning**:
    *   Create and assign personalized Diet Plans to members.
*   **System Logs**:
    *    Audit trail of important system actions.

### 🏋️ Member Module
*   **Personal Dashboard**: View membership status, package expiry, and tracking of physical stats.
*   **Digital Store**: Browse available supplements and gym products.
*   **Profile Management**: View personal details and assigned information.

### 🌐 Public Module
*   **Landing Page**: Modern, responsive home page with "Find a Member" feature.
*   **Member Verification**: Publicly verify if an individual is an active gym member.

---

## 🛠️ Tech Stack

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/)
*   **Database**: [MongoDB](https://www.mongodb.com/) (via Mongoose)
*   **Authentication**: JWT (JSON Web Tokens)
*   **Validation**: Zod
*   **Icons**: Lucide React

---

## 📂 Project Structure

```bash
src/
├── app/                  # Next.js App Router pages
│   ├── admin/            # Admin protected routes
│   ├── member/           # Member protected routes
│   ├── api/              # Backend API routes
│   ├── login/            # Authentication pages
│   └── page.tsx          # Public landing page
├── components/           # Reusable UI components
├── lib/                  # Utilities (db connection, auth helpers)
├── models/               # Mongoose Database Schemas
└── middleware.ts         # Edge middleware for route protection
```

---

## ⚡ Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Compass or Atlas URL)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/gym-management-system.git
    cd gym-management-system
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory:
    ```env
    MONGODB_URI=mongodb://localhost:27017/gym_db
    JWT_SECRET=your_super_secret_jwt_key
    ```
    *(Replace with your actual MongoDB connection string and a strong secret)*

4.  **Run the application:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage Guide

### First-Time Setup
1.  Navigate to `/signup`.
2.  Register your first account. This account will automatically become the **Super Admin**.

### Admin Workflow
1.  Go to the **Admin Dashboard** (`/admin/dashboard`).
2.  **Create Packages**: Go to *Payments* or *Packages* to define membership plans.
3.  **Add Members**: Navigate to *Members* > *Add Member*.
4.  **Record Fees**: Use the *Payments* section to log incoming transactions.

---

## 🤝 Contribution
Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
