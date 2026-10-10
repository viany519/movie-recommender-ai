# Movie Recommender AI

A web-based movie recommendation application built with Next.js and powered by a machine learning model through a FastAPI backend. The application allows users to explore movies and receive personalized movie recommendations based on their selected preferences.

## Live Demo

- **Website:** [Movie Recommender AI](PASTE_YOUR_VERCEL_URL_HERE)
- **Backend API:** [Movie Recommender API](https://movie-recommender-api.fastapicloud.dev)
- **API Documentation:** [Interactive API Docs](https://movie-recommender-api.fastapicloud.dev/docs)

## Related Repository

- **Frontend:** [movie-recommender-ai](https://github.com/viany519/movie-recommender-ai)
- **Backend:** [movie-recommender-api](https://github.com/viany519/movie-recommender-api)
- **Machine Learning Model:** [Hugging Face Model](https://huggingface.co/viany519/movie-recommender-model)

## Features

- **Movie Recommendations** — Get movie recommendations by providing a movie title.
- **Movie Exploration** — Access movie data through the backend API.
- **Machine Learning Integration** — Connects to a machine learning model hosted on Hugging Face.
- **API Integration** — Communicates with a FastAPI backend to retrieve movie data and recommendations.
- **Responsive Web Interface** — Built with Next.js and React.

## Tech Stack

- **Framework:** Next.js
- **Library:** React
- **Language:** JavaScript
- **Backend Integration:** FastAPI REST API
- **Machine Learning:** Model hosted on Hugging Face
- **Deployment:** Vercel

## Architecture

The application uses a frontend-backend architecture.

1. Users interact with the Next.js web interface.
2. The frontend sends requests to the FastAPI backend.
3. The backend processes requests and uses the movie recommendation model.
4. The backend returns the results to the frontend for display.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/viany519/movie-recommender-ai.git
   ```

2. Navigate to the frontend directory:

   ```bash
   cd movie-recommender-ai/frontend
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file in the frontend directory and configure the backend URL:

   ```env
   NEXT_PUBLIC_API_URL=https://movie-recommender-api.fastapicloud.dev
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

> If your frontend repository already opens directly at its root directory, run the commands there instead of entering the `frontend` folder.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |

## Backend API

The frontend communicates with the following endpoints:

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Check the API root response |
| `/health` | GET | Check API health |
| `/movies` | GET | Retrieve movie data |
| `/recommend` | GET | Generate movie recommendations |

See the [API documentation](https://movie-recommender-api.fastapicloud.dev/docs) for available parameters and response formats.

## Deployment

The frontend is deployed using Vercel. The backend is hosted separately using FastAPI Cloud.

To configure the production frontend, set the following environment variable in your Vercel project settings:

```env
NEXT_PUBLIC_API_URL=https://movie-recommender-api.fastapicloud.dev
```

Redeploy the frontend after changing environment variables.

## Project Structure

The frontend is organized around a Next.js application, with pages and components responsible for the user interface and API communication.

The exact directory structure may vary depending on the current implementation.

## Future Improvements

- Improve movie discovery and recommendation interfaces.
- Add movie posters and detailed movie information.
- Enhance recommendation quality and user experience.
- Introduce user preferences and recommendation history.

## Author

**Maria Yohana Vianny Leo**

Computer Science student at Bina Nusantara University with an interest in Data Science and Machine Learning.

### Project Links

- [GitHub Profile](https://github.com/viany519)
- [Frontend Repository — Movie Recommender AI](https://github.com/viany519/movie-recommender-ai)
- [Backend Repository — Movie Recommender API](https://github.com/viany519/movie-recommender-api)
- [Hugging Face Model](https://huggingface.co/viany519/movie-recommender-model)

---

**Explore the complete project:**

[Frontend Repository](https://github.com/viany519/movie-recommender-ai) · [Backend Repository](https://github.com/viany519/movie-recommender-api) · [Hugging Face Model](https://huggingface.co/viany519/movie-recommender-model)
