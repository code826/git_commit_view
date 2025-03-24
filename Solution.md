# 🏗️ Solution Documentation

## 📌 Architectural Decisions

This project is a full-stack web application that fetches and displays commit details and diffs from GitHub repositories. The architecture is designed with separation of concerns, keeping the **backend (Node.js)** and **frontend (React)** as independent modules.

### Backend (Node.js + Express)

- Serves API endpoints for fetching commit information and diffs.
- Utilizes **GitHub REST API** for fetching commit data.
- Implements error handling with a custom `ApplicationError.js`.
- Uses `.env` file to store configuration variables.

### Frontend (React + Vite)

- Fetches and displays commit details in a structured UI.
- Uses **React Router** for navigation between pages.
- Implements a **clean UI** with Tailwind CSS for responsive design.
- Displays meaningful error messages for invalid URLs.

## 🔧 Technology Choices

| Technology        | Purpose                                  |
| ----------------- | ---------------------------------------- |
| Node.js (Express) | Backend server to handle API requests    |
| React (Vite)      | Fast frontend UI rendering               |
| Tailwind CSS      | Lightweight, utility-first CSS framework |
| GitHub REST API   | Fetching repository and commit details   |

## ⚡ Intentional Deviations

1. **No Database Used**: Since commit data is fetched dynamically from GitHub, there is no need to store it in a database.
2. **No Authentication**: The app does not require authentication, making it easier for users to access commit data instantly.
3. **Single-Page App (SPA)**: React is used to build an SPA experience without reloading pages.

## 🚀 Future Improvements

### 🔍 Enhanced Search

- Add a search bar to allow users to fetch commits from any public repository by entering `owner/repo`.

### 📊 Commit Comparison

- Implement a feature to compare two commits side by side to visualize code changes.

### 🎨 UI Enhancements

- Improve UI responsiveness for better mobile experience.
- Add loading indicators while fetching commit data.

### 🔄 Continuous Deployment

- Set up **CI/CD** using GitHub Actions to automate deployment.
- Deploy backend on **Heroku** or **Vercel**, frontend on **Netlify**.

## 📢 Contributions & Feedback

- Open for feature requests and pull requests.
- Report bugs and suggest improvements via GitHub Issues.

This documentation provides an overview of the architectural decisions, technology stack, and potential future improvements for the Git Commit Viewer project. 🚀
