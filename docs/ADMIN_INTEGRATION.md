# Admin Integration Guide

This guide explains how to **administer the Finanzo Pro application** from an external system (Dashboard, CRM, Automation Tool).

Since the application is **Serverless** (Supabase), the "Backend API" is Supabase itself.

## 🔑 Authentication (Service Role)

To perform admin actions (bypass RLS policies, delete users, view all data), you must use the **Service Role Key**.

1.  Go to your Supabase Dashboard > Settings > API.
2.  Copy the `service_role` secret (Not `anon`).

> **⚠️ WARNING**: Never use the `service_role` key in the frontend/client code. Use it ONLY in your secure external backend/script.

## 📡 Connecting via REST API

You can manage data using standard HTTP requests.

**Endpoint**: `https://<YOUR_REF>.supabase.co/rest/v1`
**Header**:
```json
{
  "apikey": "YOUR_SERVICE_ROLE_KEY",
  "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"
}
```

### Examples

#### 1. List All Users (and Profiles)
```bash
GET /profiles?select=*
```

#### 2. Get All Transactions (Global)
```bash
GET /transactions?select=*&order=date.desc
```

#### 3. Ban/Delete a User
To delete a user from Auth, you must use the **Supabase Admin API** (Go/Node.js/Python SDK), not just REST.

**Node.js Example:**
```javascript
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('URL', 'SERVICE_ROLE_KEY');

// Delete User from Auth (Cascades to profiles/transactions if set up)
const { data, error } = await supabase.auth.admin.deleteUser('USER_UUID');
```

## 🗄️ Database Schema for Admin Tools

If you are building a Retool/PowerBI dashboard, connect directly to the **PostgreSQL Database**.

-   **Host**: `db.<project-ref>.supabase.co`
-   **Port**: `5432`
-   **User**: `postgres` (or your dedicated admin user)
-   **Tables**:
    -   `public.profiles`: User data (Name, Plan, Email).
    -   `public.transactions`: Financial records.
    -   `public.projects`: Goals.
    -   `public.achievements`: Gamification configs.

## 🔄 Webhooks (Events)

To receive real-time updates in your external system (e.g., "New User Registered"):

1.  Go to Supabase > Database > Webhooks.
2.  Create a webhook:
    -   **Table**: `profiles`
    -   **Event**: `INSERT`
    -   **URL**: `https://your-admin-system.com/webhook/new-user`
