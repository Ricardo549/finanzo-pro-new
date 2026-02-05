# Finanzo Pro - API Reference

This document serves as the implementation guide and reference for the Finanzo Pro application backend services, integrations, and data handling patterns.

## 🏗 Architecture Overview

The application follows a **Service-Repository Pattern** on the frontend, abstracting direct database calls (Supabase) behind typed service modules.

- **Frontend**: React (Vite) + Typescript
- **Backend/DB**: Supabase (PostgreSQL + Auth)
- **AI Engine**: Google Gemini (via Official SDK)
- **Open Finance**: Pluggy.ai (via Proxy/Direct API)

---

## 🔐 Authentication Service (`auth.service.ts`)

Handles user sessions, registration, and profile management.

| Method | Params | Return | Description |
| :--- | :--- | :--- | :--- |
| `login` | `LoginDTO` | `AuthResponse` | Authenticates via Supabase Auth (Email/Pass). |
| `register` | `RegisterDTO` | `AuthResponse` | Creates Auth User + Public Profile. |
| `logout` | - | `void` | Terminates session. |
| `isAuthenticated` | - | `boolean` | Checks for valid JWT in storage. |

> **Mock Mode**: Supports generic mock users if `VITE_ENABLE_MOCKS=true`.

---

## 💰 Transaction Service (`transaction.service.ts`)

Manages financial records (Income, Expenses, Transfers).

| Method | Params | Return | Description |
| :--- | :--- | :--- | :--- |
| `getAll` | - | `Transaction[]` | Fetches all user transactions (ordered by date desc). |
| `create` | `Omit<Transaction, 'id'>` | `Transaction` | Inserts new record linked to `auth.uid()`. |
| `delete` | `id: string` | `void` | Removes record (RLS protected). |

**Schema Mapping**:
- DB: `user_id`, `adjustment_rate` (snake_case)
- App: `userId`, `adjustmentRate` (camelCase)

---

## 🎯 Project Service (`project.service.ts`)

Manages financial goals and savings projects.

| Method | Params | Return | Description |
| :--- | :--- | :--- | :--- |
| `getAll` | - | `Project[]` | Lists active projects. |
| `create` | `Project` | `Project` | Creates new goal. |
| `update` | `id, Partial<Project>` | `Project` | Updates progress/details. |
| `delete` | `id` | `void` | Deletes project. |

---

## 🔌 Open Finance Service (`pluggyService.ts`)

Integration with Pluggy.ai for bank synchronization.

> **Security Note**: In a production environment, `CLIENT_ID` and `SECRET` should **never** be exposed on the client. This implementation is for MVP/Demo purposes or requires a backend proxy (Next.js API Routes / Edge Functions).

| Method | Description |
| :--- | :--- |
| `getAccessToken` | Exchanges ClientID/Secret for temporary API Key. |
| `createConnectToken` | Generates token to initialize the `<PluggyConnect>` widget. |
| `fetchTransactions` | Retrieves raw bank data and normalizes to `Transaction` type. |

**Environment Variables**:
- `VITE_PLUGGY_CLIENT_ID`
- `VITE_PLUGGY_CLIENT_SECRET`

---

## 🧠 AI Service (`geminiService.ts`)

Interface for Google Gemini (LLM) operations.

**Modes**:
- `SCAN`: Extracts structured data (JSON) from receipt images/text.
- `SIMULATE`: Financial math tutor (SAC vs PRICE).
- `MISSION`: Daily simplified financial challenges.
- `CHAT`: General financial advisor.

**Environment Variables**:
- `VITE_GEMINI_API_KEY`

---

## 🛠 Data Models & Schemas

### Transaction
```typescript
interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense' | 'transfer';
  recurrence: 'none' | 'monthly' | 'yearly';
}
```

### Project
```typescript
interface Project {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
}
```

## 🚨 Error Handling Pattern

Services follow a standardized error propagation:
1.  **Catch**: Intercept provider error (Supabase PostgREST error, Axios error).
2.  **Normalize**: Convert to generic Javascript `Error` with user-friendly message.
3.  **Throw**: Re-throw for UI Layer (Components/Hooks) to display Toast/Alert.

```typescript
if (error) throw new Error(error.message); // Standard pattern
```
