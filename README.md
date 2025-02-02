# NestJS Production-Ready Authentication Template

A robust authentication system built with NestJS, featuring secure session management, OAuth2 integration, and WebSocket support.

## Features

### Authentication Methods
- **Email/Password Authentication**: Traditional login system with secure password hashing
- **OAuth2 Integration**: Google authentication support out of the box
- **JWT-based Sessions**: Secure session management using HTTP-only cookies
- **Refresh Token Rotation**: Enhanced security with refresh token support

### Security Features
- **HTTP-only Cookies**: JWT tokens stored securely in HTTP-only cookies
- **Refresh Token Management**: Database-backed refresh tokens for secure token rotation
- **Password Hashing**: Secure password hashing using bcrypt
- **Environment-based Security**: Different security configurations for development and production

### Additional Features
- **WebSocket Support**: Authenticated WebSocket connections using Socket.io
- **Prisma ORM**: Type-safe database operations with Prisma
- **Structured Logging**: Production-ready logging with Pino
- **Configuration Management**: Centralized configuration using @nestjs/config
- **Input Validation**: Request validation using class-validator
- **TypeScript**: Full TypeScript support for type safety

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- Google OAuth credentials (for Google authentication)
