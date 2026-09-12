# Backend API Template

Modern REST API template built with Express.js and TypeScript.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 4.21+
- **Language**: TypeScript 5.9+
- **Database**: TCB managed PostgreSQL (via CloudBase JS SDK)
- **Validation**: Zod
- **Testing**: Jest + Supertest

## Project Structure

```
backend/
├── src/
│   ├── __tests__/             # Test files
│   ├── config/                # Configuration
│   │   ├── database.ts        # Database client
│   │   ├── env.ts             # Environment validation
│   │   └── logger.ts          # Pino logger setup
│   ├── middleware/            # Express middleware
│   │   ├── errorHandler.ts   # Error handling
│   │   ├── logger.ts          # HTTP logging
│   │   └── validation.ts     # Zod validation
│   ├── modules/               # Feature modules (routes + handlers)
│   │   └── system.ts          # System & health checks
│   ├── types/                 # TypeScript types & Zod schemas
│   ├── app.ts                 # Express app setup
│   └── index.ts               # Server entry point
├── .env.example               # Environment template
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Development

Start the development server with hot reload:
```bash
npm run dev
```

Server will start at `http://localhost:3000`

### Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Production Build

Build the project:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## API Endpoints

### System Routes

- `GET /api/v1/` - API welcome message
- `GET /api/v1/health` - Basic health check
- `GET /api/v1/health/ready` - Readiness check
- `GET /api/v1/health/live` - Liveness check
- `GET /api/v1/version` - API version
- `GET /api/v1/ping` - Ping endpoint
- `GET /api/v1/status` - System status
