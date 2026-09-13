# Feedback & Community Microservice

Isolated microservice managing community comments, article helpfulness ratings, and support ticket submissions.

## Capabilities
- Guide helpfulness voting (`yes`/`no`).
- User comments submission and listing.
- Diagnostic support ticket logging.

## Architecture & Isolation
- **Port**: `4003`
- **Health Check**: `GET /health`
