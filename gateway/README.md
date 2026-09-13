# CyberTech API Gateway

Nginx reverse proxy and API routing gateway for the CyberTech microservices ecosystem.

## Route Map
- `/*` -> `web-portal:3050`
- `/api/v1/payments/*` -> `payment-service:4001`
- `/api/v1/auth/*` -> `auth-service:4002`
- `/api/v1/feedback/*` -> `feedback-service:4003`
- `/api/v1/analytics/*` -> `analytics-service:4004`
- `/health` -> Gateway status

## Port
- Exposed on port `8080`.
