# 🎬 Movie Recommender AI

A web-based movie recommendation application that helps users discover movies and explore similar titles through an interactive interface.

Built with **Next.js and React**, this project connects to a FastAPI backend to retrieve movie data and generate recommendations.

## ✨ Features

- **Movie Search** — Search for movies by title.
- **Autocomplete Suggestions** — Get title suggestions while searching.
- **Similar Movie Recommendations** — Discover movies related to a selected title.
- **Movie Details** — Explore movie information through an interactive detail view.
- **Responsive Interface** — Browse and discover movies through a clean, user-friendly interface.

## 🛠️ Tech Stack

- **Framework:** Next.js
- **Library:** React
- **Language:** JavaScript
- **Backend Integration:** FastAPI REST API

## 🏗️ Architecture

The frontend communicates with the backend through HTTP requests.

```text
User
  │
  ▼
Next.js Frontend
  │
  │ HTTP Requests
  ▼
FastAPI Backend
  │
  ▼
Movie Data & Recommendation Logic
  │
  ▼
Recommended Movies
```

## 🔗 Project Links

| Resource | Link |
|---|---|
| Backend Repository | [movie-recommender-api](https://github.com/viany519/movie-recommender-api) |
| Live Backend API | [FastAPI Cloud](https://movie-recommender-api.fastapicloud.dev) |
| API Documentation | [Swagger UI](https://movie-recommender-api.fastapicloud.dev/docs) |

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/viany519/movie-recommender-ai.git
cd movie-recommender-ai
```

If the application is located in a `frontend` directory, navigate into it:

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the frontend application directory and add:

```env
NEXT_PUBLIC_API_URL=https://movie-recommender-api.fastapicloud.dev
```

This variable specifies the URL of the deployed FastAPI backend.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
npm start
```

## 🌐 Deployment

The frontend can be deployed using a Next.js-compatible hosting platform, such as [Vercel](https://vercel.com/).

Configure `NEXT_PUBLIC_API_URL` in the deployment environment variables to point to the deployed backend API.

## 📌 Project Scope

This project demonstrates frontend development, REST API integration, and the presentation of movie recommendation results through an interactive web application.

The recommendation functionality depends on the availability and correct configuration of the backend service.

## 👩‍💻 Author

**Viany Leo**

GitHub: [@viany519](https://github.com/viany519)

---

Part of the **Movie Recommender AI** project.

For the recommendation API and backend implementation, visit the [backend repository](https://github.com/viany519/movie-recommender-api).
