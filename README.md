# Building a Real-Time Application with µWebSockets.js

Real-time applications enable instant communication and updates. This guide walks you through building a WebSocket-based app using [uWebSockets.js](https://github.com/uNetworking/uWebSockets.js) instead of Express.js.

## Prerequisites

Ensure you have the following installed:

- **NodeJS**: `20.18.0`
- **NPM**: `10.8.2`
- **TypeScript**: `5.9.2`
- **µWebSockets.js**: `20.52.0`
- **PostgreSQL**: `12.14`

## Setting Up the Project

### 1. Cloning the Repository

Clone your project repository:

```bash
git clone https://github.com/krlan2789/micro-ws-app.git
```

### 2. Navigating to the Project Directory

```bash
cd micro-ws-app
```

### 3. Installing Dependencies

```bash
npm install
```

## Configuring the Database

### 1. Creating an Environment File

Copy example.env to .env in the project root:

```bash
cp example.env .env
```

### 2. Updating the Configuration

Edit .env with your database and app settings:

```ini
APP_PORT=3006
UWS_IDLE_TIMEOUT=30
UWS_MAX_PAYLOAD_LENGTH=1024

DB_USER=postgres
DB_HOST=localhost
DB_NAME=db_name
DB_PASS=password
DB_PORT=5432
DB_MAX_CONNECTION=16
DB_IDLE_TIMEOUT=30000
```

## Running the Application

### 1. Ensure You’re in the Project Directory

```bash
cd micro-ws-app
```

### 2. Starting the Application

- **Development Mode**:

   ```bash
   npm run dev
   ```

- **Production Mode**:

   ```bash
   npm start
   ```

- **Production Mode with PM2** (if configured):

   ```bash
   npm run start:pm2
   ```

### 3. Testing the WebSocket Connection

Connect using a WebSocket client to:

```
ws://localhost:3006?token=your_token
```

Or run the test script (if available):

```bash
npm run test:ws
```

## Deploying the Application

For deployment instructions, refer to [this deployment note](https://erlankurnia.github.io/note/2/WebSocket%20Service%20on%20VPS).

## Conclusion

You now have a working real-time WebSocket app but much faster, ready for features like chat, notifications, or collaboration.