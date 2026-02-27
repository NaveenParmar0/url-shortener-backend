# 🔗 Linklytics — URL Shortener

> **Shorten Links. Amplify Impact.**  
> A full-stack URL shortener with real-time click analytics, built with Spring Boot + React.

🌐 **Live Demo:** [url-shortener-backend-self.vercel.app](https://url-shortener-backend-self.vercel.app)  
⚙️ **Backend API:** [url-shortener-backend-ikye.onrender.com](https://url-shortener-backend-ikye.onrender.com)

---

## ✨ Features

- 🔗 **Instant URL Shortening** — Shorten any long URL in one click
- 📊 **Click Analytics** — Track clicks with date-range charts
- 🔐 **JWT Authentication** — Secure register/login with BCrypt + JWT tokens
- 📋 **Dashboard** — View, copy, and manage all your short links
- ☁️ **Cloud Deployed** — Frontend on Vercel, Backend on Render, Database on Railway MySQL

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router, Axios, Recharts, Lucide Icons |
| **Backend** | Spring Boot 3.4.3, Spring Security 6, Spring Data JPA, Hibernate |
| **Auth** | JWT (jjwt 0.12.6), BCrypt |
| **Database** | MySQL (Railway cloud) |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Java 20+ (JDK)
- Node.js 18+
- MySQL or Railway cloud DB

### 1. Clone the repo
```bash
git clone https://github.com/NaveenParmar0/url-shortener-backend.git
cd url-shortener-backend
```

### 2. Configure the backend
Create `src/main/resources/application-local.properties`:
```properties
spring.datasource.url=jdbc:mysql://<HOST>:<PORT>/<DB>?allowPublicKeyRetrieval=true&useSSL=false
spring.datasource.username=<USERNAME>
spring.datasource.password=<PASSWORD>
jwt.secret=<YOUR_BASE64_SECRET>
jwt.expiration=172800000
```

### 3. Run the backend
```bash
# Windows
run.bat

# Or manually with Maven
mvnw spring-boot:run -DskipTests
```

### 4. Run the frontend
```bash
cd url-shortner-frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 🌐 API Endpoints

### Auth (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/public/register` | Register new user |
| `POST` | `/api/auth/public/login` | Login and get JWT |

### URLs (Authenticated — Bearer Token required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/urls/shorten` | Create a short URL |
| `GET` | `/api/urls/myurls` | Get all URLs for current user |
| `GET` | `/api/urls/analytics/{shortUrl}` | Get click events for a short URL |
| `GET` | `/api/urls/totalClicks` | Get total clicks grouped by date |

### Redirect (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/{shortUrl}` | Redirect to original URL |

---

## 🏗️ Project Structure

```
url-shortener-backend/
├── src/main/java/com/url/url_shortener_sb/
│   ├── controller/          # REST Controllers
│   ├── service/             # Business logic
│   ├── models/              # JPA Entities
│   ├── dto/                 # Data Transfer Objects
│   ├── repository/          # Spring Data JPA Repos
│   └── security/            # Spring Security + JWT
│       └── jwt/             # JWT filter & utils
├── src/main/resources/
│   └── application.properties
├── url-shortner-frontend/   # React + Vite frontend
│   ├── src/
│   │   ├── pages/           # Route pages
│   │   ├── components/      # Shared components
│   │   ├── api.js           # Axios API client
│   │   └── AuthContext.jsx  # Auth state management
│   └── vercel.json          # Vercel SPA routing config
└── Dockerfile               # Multi-stage Docker build
```

---

## ☁️ Deployment

### Backend → Render
1. Connect the GitHub repo on [render.com](https://render.com)
2. Set **Runtime** to `Docker`
3. Add environment variables:

| Key | Value |
|-----|-------|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://...` |
| `SPRING_DATASOURCE_USERNAME` | `root` |
| `SPRING_DATASOURCE_PASSWORD` | `...` |
| `JWT_SECRET` | your base64 secret |
| `JWT_EXPIRATION` | `172800000` |

### Frontend → Vercel
1. Import repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `url-shortner-frontend`
3. Framework: **Vite** (auto-detected)
4. Deploy!

---

## 👨‍💻 Author

**Naveen Parmar**  
GitHub: [@NaveenParmar0](https://github.com/NaveenParmar0)
