# Byway 🎓

> A modern, elegant platform for online learning and teaching.

**Byway** is a full-stack online education platform designed to empower learners and instructors with a seamless, beautiful, and efficient educational experience. Built with modern web technologies and clean architecture principles, it provides intuitive navigation, robust features, and a delightful user interface.

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Problem It Solves](#-problem-it-solves)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Key Features Detail](#-key-features-detail)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)

---

## ✨ Features

### For Students
- 📚 **Course Discovery & Enrollment** - Browse and enroll in courses with detailed descriptions
- 📖 **Interactive Learning** - Access lessons with video, audio, and text content
- 📊 **Progress Tracking** - Monitor learning progress with detailed analytics
- 🏆 **Certificates** - Earn certificates upon course completion
- ⭐ **Reviews & Ratings** - Review and rate courses
- 💬 **Real-time Chat** - Communicate with instructors via real-time messaging
- 💰 **Wallet System** - Manage course purchases with an integrated wallet
- 🔔 **Notifications** - Stay updated with real-time notifications

### For Instructors
- 🎓 **Course Creation** - Create and manage courses with rich content
- 📝 **Lesson Management** - Organize lessons with various content types
- 📈 **Revenue Dashboard** - Track earnings and revenue analytics
- 👥 **Student Management** - View enrolled students and their progress
- 💼 **Instructor Profile** - Showcase expertise and qualifications
- 📊 **Analytics** - Monitor course performance and student engagement
- 💵 **Payout System** - Receive revenue share from course sales

### For Administrators
- ✅ **Course Approval** - Review and approve/incline course submissions
- 👤 **User Management** - Manage users, instructors, and roles
- 📊 **Platform Analytics** - View comprehensive platform statistics
- 💰 **Revenue Management** - Monitor platform-wide revenue and transactions
- 🔐 **Role-Based Access Control** - Secure admin-only operations

---

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 15.2.4 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Styling**: TailwindCSS 4
- **State Management**: Zustand 5
- **Data Fetching**: TanStack Query (React Query) 5
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Real-time Communication**: Socket.IO Client 4.8
- **Authentication**: JWT with httpOnly cookies
- **OAuth**: Google OAuth, Facebook Auth
- **Payments**: Stripe, PayPal integration
- **PDF Generation**: jsPDF, html2canvas
- **Icons**: Lucide React
- **Toast Notifications**: Sonner

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js 5
- **Language**: TypeScript 5
- **Architecture**: Clean Architecture (Layered Architecture)
- **Database**: PostgreSQL with Prisma ORM 6
- **Authentication**: JWT (Access + Refresh tokens)
- **Real-time**: Socket.IO 4.8
- **Payment Gateways**: 
  - Stripe (Primary)
  - PayPal (Integrated)
  - Internal Wallet System
- **File Storage**: Cloudinary
- **Email Service**: Nodemailer (Gmail)
- **PDF Generation**: PDFKit, pdf-lib
- **Certificate Generation**: Canvas
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Zod

### DevOps & Deployment
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Deployment**: Render / EC2
- **Database**: PostgreSQL (external service)
- **Image Registry**: GitHub Container Registry (GHCR)

---

## 🏗 Architecture

Byway follows **Clean Architecture** principles with clear separation of concerns:

```
backend/src/
├── domain/          # Business logic & entities (no dependencies)
│   ├── entities/    # Domain entities
│   ├── types/       # Domain types & interfaces
│   ├── enum/        # Domain enums
│   └── value-object/# Value objects
├── app/             # Application layer (use cases)
│   ├── usecases/    # Business use cases
│   ├── repositories/# Repository interfaces
│   ├── providers/   # Provider interfaces
│   └── dtos/        # Data Transfer Objects
├── infra/           # Infrastructure layer (implementations)
│   ├── repositories/# Repository implementations (Prisma)
│   ├── providers/   # Provider implementations
│   └── database/    # Database configuration
├── presentation/    # Presentation layer (HTTP & WebSocket)
│   ├── express/     # Express.js setup & middleware
│   ├── http/        # HTTP controllers
│   ├── socketio/    # Socket.IO handlers
│   └── validators/  # Request validators
└── di/              # Dependency Injection
```

### Key Principles
- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Single Responsibility**: Each class/function has one reason to change
- **Interface Segregation**: Interfaces are specific to client needs
- **Separation of Concerns**: Clear boundaries between layers

---

## 🎯 Problem It Solves

Byway addresses several challenges in online education:

### 1. **Fragmented Learning Experience**
   - **Problem**: Many platforms lack seamless course management and progress tracking
   - **Solution**: Integrated dashboard with comprehensive progress tracking and analytics

### 2. **Instructor Monetization**
   - **Problem**: Instructors struggle with payment processing and revenue management
   - **Solution**: Built-in payment system with automatic revenue distribution and wallet integration

### 3. **Student-Instructor Communication**
   - **Problem**: Limited communication channels between students and instructors
   - **Solution**: Real-time chat system with notifications

### 4. **Course Quality Control**
   - **Problem**: Ensuring course quality without proper moderation
   - **Solution**: Admin approval system with comprehensive review workflow

### 5. **Scalable Architecture**
   - **Problem**: Monolithic applications that are hard to maintain
   - **Solution**: Clean architecture with clear separation, making it easy to scale and maintain

### 6. **Security & Authentication**
   - **Problem**: Security vulnerabilities in authentication systems
   - **Solution**: JWT with httpOnly cookies, OAuth integration, and role-based access control

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- npm or yarn
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Byway
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Setup environment variables
   cp .env.example .env.development
   # Edit .env.development with your configuration
   
   # Setup database
   npx prisma generate
   npx prisma migrate dev
   
   # Run development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Setup environment variables
   cp .env.example .env.local
   # Edit .env.local with your configuration
   
   # Run development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

### Docker Setup

```bash
# Build and run with Docker Compose
docker-compose up -d
```

---

## 📁 Project Structure

```
Byway/
├── backend/
│   ├── src/
│   │   ├── domain/          # Domain layer
│   │   ├── app/             # Application layer
│   │   ├── infra/           # Infrastructure layer
│   │   ├── presentation/    # Presentation layer
│   │   └── di/              # Dependency injection
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   ├── api/                 # API client functions
│   ├── hooks/               # Custom React hooks
│   ├── stores/              # Zustand stores
│   ├── types/               # TypeScript types
│   ├── lib/                 # Utility libraries
│   ├── public/              # Static assets
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## 🔑 Key Features Detail

### Authentication & Authorization
- JWT-based authentication with access and refresh tokens
- httpOnly cookies for secure token storage
- OAuth integration (Google, Facebook)
- Role-based access control (Admin, Instructor, User)
- Email verification with OTP
- Password reset functionality

### Course Management
- Course creation with rich metadata
- Lesson organization (video, audio, text)
- Course approval workflow
- Category management
- Course search and filtering
- Course reviews and ratings

### Payment System
- Multiple payment methods:
  - Stripe (credit/debit cards)
  - PayPal integration
  - Internal wallet system
- Secure checkout process
- Automatic revenue distribution
- Transaction history
- Refund management

### Real-time Features
- Socket.IO for real-time communication
- Live chat between users
- Real-time notifications
- Unread message counts

### Learning Features
- Progress tracking per lesson
- Course completion certificates (PDF generation)
- Enrollment management
- Learning analytics

### Wallet System
- Balance management
- Top-up functionality
- Transaction history
- Wallet-to-wallet transfers

---

## 🚢 Deployment

### Environment Variables

#### Backend (.env.production)
```env
NODE_ENV=production
PORT=5001
DATABASE_URL=postgresql://...
JWT_SECRET=...
ACCESS_TOKEN_SIGNATURE=...
REFRESH_TOKEN_SIGNATURE=...
COOKIE_SECRET=...
CORS_ORIGIN=https://your-frontend-url.com
FRONTEND_URL=https://your-frontend-url.com
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
CLOUDINARY_URL=...
EMAIL_USER=...
EMAIL_PASS=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=...
NEXT_PUBLIC_FACEBOOK_APP_ID=...
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
```

### CI/CD Pipeline

The project uses GitHub Actions for automated deployment:
- Builds Docker images on push to `master`
- Pushes images to GitHub Container Registry
- Deploys to EC2/Render automatically

See `.github/workflows/deploy.yml` for details.

---

## 🔒 Security Features

- httpOnly cookies for JWT storage
- CORS configuration
- Rate limiting on sensitive endpoints
- Input validation with Zod
- SQL injection prevention (Prisma ORM)
- XSS protection
- Helmet.js for security headers
- Environment variable protection

---

## 📝 License

[Specify your license here]

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👥 Authors

Rashin KP · [Rashin’s portfolio](https://rashinkp.vercel.app/)

---

## 🙏 Acknowledgments

- Built with ❤️ using modern web technologies
- Inspired by clean architecture principles
- Powered by the open-source community

---

**Made with ❤️ for the online learning community**
