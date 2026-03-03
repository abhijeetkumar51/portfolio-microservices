# 🚀 Portfolio Microservices

A personal portfolio website built with a **microservices architecture**, containerized with Docker and orchestrated using Docker Compose.

![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-Gateway-009639?style=for-the-badge&logo=nginx&logoColor=white)

---

## 📐 Architecture

```
                    ┌──────────────────┐
                    │   Nginx Gateway  │  Port 80
                    │   (API Gateway)  │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼───────┐ ┌───▼────────┐ ┌───▼──────────┐
     │ Frontend       │ │ Contact    │ │ Analytics    │
     │ Service        │ │ Service    │ │ Service      │
     │ (Nginx:3000)   │ │ (Node:3001)│ │ (Node:3002)  │
     │ Static Files   │ │ Nodemailer │ │ Page Views   │
     └────────────────┘ └────────────┘ └──────────────┘
```

### Services

| Service | Technology | Port | Description |
|---------|-----------|------|-------------|
| **API Gateway** | Nginx | `80` | Routes traffic, gzip compression, security headers |
| **Frontend** | Nginx | `3000` | Serves static HTML/CSS/JS portfolio files |
| **Contact** | Node.js/Express | `3001` | Handles contact form → sends email via Gmail SMTP |
| **Analytics** | Node.js/Express | `3002` | Tracks page views, unique visitors, referrers |

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript, Font Awesome, Google Fonts
- **Backend:** Node.js, Express.js, Nodemailer
- **Infrastructure:** Docker, Docker Compose, Nginx
- **Email:** Gmail SMTP with App Passwords

---

## 🚀 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- A Gmail account with [App Password](https://myaccount.google.com/apppasswords) enabled

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhijeetkumar51/portfolio-microservices.git
   cd portfolio-microservices
   ```

2. **Configure email credentials**
   ```bash
   cp contact-service/.env.example contact-service/.env
   ```
   Edit `contact-service/.env` and add your Gmail App Password:
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_char_app_password
   ```

3. **Build and run all services**
   ```bash
   docker-compose up --build
   ```

4. **Open in browser**
   ```
   http://localhost
   ```

---

## 📡 API Endpoints

### Contact Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/contact` | Send a contact form message |
| `GET` | `/health/contact` | Health check |

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 1234567890",
  "subject": "Project Inquiry",
  "message": "Hello! I'd like to discuss a project."
}
```

### Analytics Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analytics/pageview` | Record a page view |
| `GET` | `/api/analytics/stats` | Get all analytics data |
| `GET` | `/api/analytics/page/:name` | Get stats for a specific page |
| `GET` | `/health/analytics` | Health check |

---

## 📁 Project Structure

```
portfolio-microservices/
├── docker-compose.yml           # Orchestrates all services
│
├── gateway/                     # API Gateway
│   ├── Dockerfile
│   └── nginx.conf               # Routing rules
│
├── frontend/                    # Frontend Service
│   ├── Dockerfile
│   ├── index.html               # Home page
│   ├── about.html               # About page
│   ├── projects.html            # Projects page
│   ├── certificates.html        # Certificates page
│   ├── contact.html             # Contact page (uses /api/contact)
│   ├── css/                     # Stylesheets
│   └── js/                      # JavaScript files
│
├── contact-service/             # Contact Microservice
│   ├── Dockerfile
│   ├── server.js                # Express server + Nodemailer
│   ├── package.json
│   └── .env.example             # Environment template
│
└── analytics-service/           # Analytics Microservice
    ├── Dockerfile
    ├── server.js                # Express server + in-memory store
    └── package.json
```

---

## ✨ Features

- 🎨 **Modern UI** — Responsive portfolio with animations, gradients, and glassmorphism effects
- 📧 **Working Contact Form** — Sends styled HTML emails via Gmail SMTP with rate limiting
- 📊 **Page Analytics** — Tracks page views, unique visitors, daily trends, and referrers
- 🔀 **API Gateway** — Centralized routing with Nginx, gzip compression, and security headers
- 🐳 **Fully Dockerized** — One command to build and run everything
- 🔒 **Secure** — Environment variables for secrets, rate limiting on contact endpoint

---

## 🧑‍💻 Author

**Abhijeet Kumar**
- Cloud & DevOps Engineer | AI & Web Dev Enthusiast
- 📧 chaudharyabhijeet51@gmail.com
- [GitHub](https://github.com/abhijeetkumar51)
- [LinkedIn](https://www.linkedin.com/in/abhijeetkumar51)
- [Instagram](https://www.instagram.com/abhijeet_br.33)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
