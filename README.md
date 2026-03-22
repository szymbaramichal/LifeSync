# LifeSync

LifeSync is a full-stack application designed to help users manage their daily activities, track expenses, and synchronize their personal data. The application consists of an Angular-based web User Interface (UI) and a .NET-based Application Programming Interface (API).

## Domains and Features

The application is structured around specific domains, separating concerns and keeping related features together.

### 1. Authentication & Security
LifeSync uses a robust authentication system to ensure data privacy and secure access to the API and UI.
* **UI Features:**
  * **User Registration:** Allows new users to sign up using their email and password (powered by Firebase Authentication).
  * **User Login:** Secure login with existing credentials.
  * **Route Guards:** Restricts access to authenticated routes (e.g., Dashboard) and redirects unauthenticated users to the guest views.

### 2. User Profile Domain
Manages user-specific data and personalized settings within the LifeSync ecosystem.
* **UI Features:**
  * **Create Profile View:** A dedicated onboarding screen (`/create-profile`) for users to set up their initial data after authenticating.
  * **My Profile View:** A profile management screen (`/dashboard/me`) to view and update user details.

### 3. Expenses Domain
A one of core features of LifeSync that allows users to track their financial transactions and manage their budget. 
User can exist in many expenses group with friends. When setting up account - user's private group is created automatically.
* **UI Features:**
  * **Expense Management:** Interfaces integrated into the dashboard to add, view, edit, and delete daily expenses.

### 4. Dashboard Domain
The central hub for users to get an overview of their LifeSync data.
* **UI Features:**
  * **Main Dashboard:** The primary authenticated view (`/dashboard`) summarizing key metrics, recent expenses, and quick actions.
  * **Layouts:** Distinct layouts for guests (authentication and profile creation flow) and authenticated users (sidebar, top navigation, and main content area).

## Technology Stack

* **Frontend:** Angular, Firebase Authentication, Angular Material Design
* **Backend:** .NET (C#), Entity Framework Core, Custom mediator implementation, FluentValidation
