# Building a Fast Real-Time Application with µWebSockets.js

Real-time applications are revolutionizing the way we interact with technology, enabling instantaneous communication and updates. At the core of these systems lies WebSocket technology, which facilitates seamless two-way communication between clients and servers. In this article, we will delve into the process of building a WebSocket-based application using [uWebSockets.js](https://github.com/uNetworking/uWebSockets.js), covering everything from prerequisites to deployment.

## Why Choose µWebSockets.js Over Express.js + ws?

While Express.js combined with the `ws` (WebSocket Standard) library is a popular choice for building WebSocket applications, µWebSockets.js offers several advantages that make it ideal for high-performance, real-time systems:

- **Performance**: µWebSockets.js is engineered for speed and efficiency, handling significantly more concurrent connections and messages than Express.js + ws.
- **Low Latency**: Its optimized C++ core delivers lower latency, making it suitable for applications where real-time responsiveness is critical.
- **Resource Efficiency**: µWebSockets.js consumes less memory and CPU, allowing you to scale your application with fewer resources.
- **Built-in Features**: It provides advanced features like native SSL support, per-message compression, and automatic ping/pong handling out of the box.
- **Scalability**: Designed for large-scale deployments, µWebSockets.js can handle millions of simultaneous connections with minimal overhead.

For applications demanding maximum throughput and minimal delay—such as chat systems, live dashboards, or multiplayer games—µWebSockets.js is a superior choice.

## Prerequisites

Before diving into the setup, ensure you have the following tools and versions installed:

- **NodeJS**: `20.18.0`
- **NPM**: `10.8.2`
- **TypeScript**: `5.9.2`
- **uWebSockets.js**: `20.52.0`
- **PostgreSQL**: `12.14`

These tools form the backbone of the application, enabling efficient development and database management.

## Setting Up the Project

### Step 1: Cloning the Repository

Begin by cloning the project repository to your local machine. This repository contains all the necessary files and configurations to get started:

```shell
$ git clone https://github.com/krlan2789/micro-ws-app.git
```

### Step 2: Navigating to the Project Directory

Once cloned, navigate to the project directory:

```shell
$ cd micro-wss-app
```

### Step 3: Installing Dependencies

Install the required dependencies using NPM. This ensures that all necessary packages are available for the application:

```shell
$ npm install
```

Alternatively, you can use the shorthand command:

```shell
$ npm i
```

## Configuring the Database

To enable database connectivity, follow these steps:

### Step 1: Creating an Environment File

Duplicate the `example.env` file or create a new `.env` file in the project root directory. This file will store your application and database settings.

### Step 2: Updating the Configuration

Edit the `.env` file with your specific database credentials and application settings:

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

These configurations ensure seamless communication between the application and the PostgreSQL database.

## Running the Application

With the setup complete, you can now run the application. Choose the appropriate mode based on your requirements:

### Step 1: Navigating to the Project Directory

Ensure you are in the project directory:

```shell
$ cd micro-wss-app
```

### Step 2: Starting the Application

- **Development Mode**: Ideal for testing and debugging during development.

	```shell
	$ npm run dev
	```

- **Production Mode**: Suitable for deploying the application in a live environment.

	```shell
	$ npm start
	```

- **Production Mode with PM2**: For enhanced process management, use PM2 (requires installation).

	```shell
	$ npm start:pm2
	```

### Step 3: Testing the WebSocket Connection

To verify the WebSocket functionality, use a WebSocket testing tool and connect using the following URL format:

```http
[ws/wss]://[ip/hostname]:[port]?token=user_token
```

#### Example URLs:

- **HTTP**: `ws://localhost:8765?token=user1240635408404344554`
- **HTTPS**: `wss://localhost:8765?token=user1240635408404344554`

Alternatively, you can run the following command to test the WebSocket connection:

```shell
$ npm run test:ws
```

## Deploying the Application

Deploying the application to a VPS or cloud hosting environment is straightforward. For detailed instructions, refer to [this (Nginx)](/secure-websocket-service-on-vps-using-nginx) or [this (Apache)](/secure-websocket-service-on-vps-using-apache) deployment notes.

## Conclusion

By following this guide, you can efficiently set up and run a WebSocket-based application using µWebSockets.js. This setup is perfect for building real-time features such as chat applications, live notifications, or collaborative tools. With WebSocket technology, the possibilities for creating dynamic and interactive applications are endless.
