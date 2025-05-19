# 🕶️ LifeInvader Clone – GTAV-Inspired Social Network

A modern social media web app inspired by **LifeInvader** from GTA V. Built with **Django** on the backend and **ReactJS** on the frontend. Users can register, post updates, follow others, and interact through likes and feeds.

## 🚀 Features

* 🔐 **Authentication:**

  * Register and login using email/password
  * Login via Google OAuth2
  * JWT-based authentication with secure cookie storage

* 👤 **User Profiles:**

  * Upload and update profile photo
  * Edit basic profile info
  * Follow and unfollow users

* 📰 **Social Feed:**

  * View posts from users you follow
  * Like/unlike posts
  * Create new text-based posts

* 🔍 **Search:**

  * Find users and explore profiles

## 🛠️ Tech Stack

### Backend (Django)

* Django & Django REST Framework
* JWT Authentication (with cookies)
* OAuth2 (Google login)
* PostgreSQL / SQLite

### Frontend (React)

Built with **React 19**, and the following libraries:

* **React Router DOM** – client-side routing
* **Axios** – API communication
* **React Icons** – icon set
* **Chakra UI** – component library
* **Chakra UI Icons** – icon integration for Chakra
* **@react-oauth/google** – Google OAuth login integration

## 📸 Screenshots

> Coming soon

## 🔧 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/lifeinvader-clone.git
cd lifeinvader-clone
```

### 2. Backend Setup

```bash
cd backend
python -m venv env
source env/bin/activate  # or `env\Scripts\activate` on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

## 🔐 Environment Variables

Make sure to configure:

* Django `.env`: secret keys, database, Google OAuth
* React `.env`: Google Client ID, backend API base URL

## 📦 Deployment

You can deploy this using:

* Heroku + Netlify
* Render + Vercel
* Dockerized setup (coming soon)

## 🧠 Future Plans

* Comments on posts
* Notifications
* Media uploads
* Chat / messaging

## 📄 License

MIT License.
