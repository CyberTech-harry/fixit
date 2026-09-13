# Auth & Identity Microservice

Standalone user identity, password hashing, and JWT token issuance microservice.

## Capabilities
- User registration with Bcrypt password hashing.
- User login with signed JSON Web Tokens (JWT).
- Role-based authorization: `admin`, `editor`, `user`.
- Route verification endpoint for API Gateway and Next.js middleware.

## Architecture & Isolation
- **Port**: `4002`
- **Isolation**: `AUTH_SECRET` and user hashes are stored strictly in this isolated container.
- **Health Check**: `GET /health`
