# 🚀 codeQuest: The Ultimate Competitive Programming Arena

Welcome to **codeQuest**, the ultimate arena for competitive programming! Sharpen your skills, solve intricate problems, and rise to the top of the leaderboard. This platform is designed to help you practice and improve your problem-solving abilities in a modern, user-friendly environment.

## 🔗 Live Demo & Deployment

* **Web Application (Frontend & Main Backend):** Deployed on **Vercel**
* **Webhook Handler:** Deployed on **Render**

---

## 🛠️ Tech Stack

This project is built with a modern, robust, and scalable tech stack:

* **Framework:** **Next.js** (with TypeScript)
* **Database:** **PostgreSQL**
* **ORM:** **Prisma**
* **Code Evaluation Engine:** **Judge0 API** (Third-party)
* **Asynchronous Task Queue:** **Redis** (used by Judge0)
* **CI/CD & Version Control:** **GitHub** & **GitHub Actions**

---

## ✨ Core Features

* **Problem Solving:** A wide range of problems to solve, similar to platforms like LeetCode.
* **Online Code Editor:** A built-in editor with syntax highlighting for a smooth coding experience.
* **Multi-Language Support:** Submit your solutions in JavaScript, C++, or Rust.
* **Instant Feedback:** Asynchronous code evaluation provides instant feedback on your submissions.
* **User Authentication:** Secure user login and registration.
* **Git-Based Problem Management:** A streamlined workflow for adding and updating problems using GitHub pull requests and Actions.

---

## 🏛️ System Architecture

codeQuest is built on a decoupled, asynchronous architecture to ensure scalability, security, and a responsive user experience.

### Main Components:

* **Browser (Client):** The user interface where users interact with the platform.
* **Next.js Server:** The primary server that handles user requests, authentication, and database interactions.
* **PostgreSQL Database:** The central database for storing user data, problems, submissions, and test case results.
* **Judge0 API Server:** A dedicated, third-party service that compiles and runs user-submitted code in a secure, sandboxed environment.
* **Redis Queue:** Used by Judge0 to manage and distribute code evaluation tasks to its workers.
* **Webhook Handler (Node.js):** A separate service that listens for results from Judge0 and updates the database accordingly.

---

## 🔄 Core Workflows

### 1. User Code Submission & Judging

This workflow is fully asynchronous to prevent blocking the main server and to handle computationally expensive tasks efficiently.

1.  **Submit Code:** A user submits their code through the online editor.
2.  **API Request:** The Next.js server receives the code, language, and problem ID.
3.  **DB Entry:** A new submission record is created in the PostgreSQL database with a **`Pending`** status.
4.  **Offload to Judge0:** The server sends the code, test cases, and a webhook URL to the Judge0 API.
5.  **Asynchronous Evaluation:** Judge0 queues the submission in Redis and executes the code against all test cases in a secure, sandboxed environment.
6.  **Webhook Callback:** Once evaluation is complete, Judge0 sends the results (Accepted, Rejected, etc.) to the webhook handler on Render.
7.  **Update DB:** The webhook handler updates the submission status in the database.
8.  **Poll for Results:** The user's browser polls the Next.js server to get the final result, which is then displayed.

### 2. Adding New Problems (Git-based)

This workflow leverages GitHub and GitHub Actions to create a robust, version-controlled system for managing problems.

1.  **Contribution:** A new problem is submitted via a Pull Request (PR) to the public **`admin` repository**.
2.  **Validation & Merge:** The PR is reviewed and, if approved, merged into the `main` branch of the `admin` repo.
3.  **GitHub Action (Step 1):** The merge triggers a GitHub Action that opens a new PR from the `admin` repo to the main `web` repository.
4.  **Deployment Merge:** This second PR is reviewed and merged.
5.  **GitHub Action (Step 2):** This merge triggers a final GitHub Action that:
    * Downloads the new problem files.
    * Upserts the problem data (title, description, boilerplate code) into the PostgreSQL database.
6.  **Problem Live:** The new problem is now available on the platform for users to solve.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn
* PostgreSQL database

### Installation

1.  **Clone the `web` repository:**
    ```bash
    git clone [https://github.com/your-username/codequest-web.git](https://github.com/your-username/codequest-web.git)
    cd codequest-web
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the following:
    ```env
    DATABASE_URL="your-postgresql-database-url"
    NEXTAUTH_SECRET="your-nextauth-secret"
    JUDGE0_URI="[https://judge0-ce.p.rapidapi.com](https://judge0-ce.p.rapidapi.com)"
    X_RAPIDAPI_KEY="your-rapidapi-key"
    X_RAPIDAPI_HOST="judge0-ce.p.rapidapi.com"
    JUDGE0_CALLBACK_URL="your-render-webhook-url"
    ```

4.  **Run database migrations:**
    ```bash
    npx prisma migrate dev
    ```

5.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

To contribute:

1.  **Fork the Project**
2.  **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3.  **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4.  **Push to the Branch** (`git push origin feature/AmazingFeature`)
5.  **Open a Pull Request**

We look forward to your contributions!
