# Coders House

## Description

A fully featured realtime communication project, build with MERN stack similar to club house application.
This capstone project includes all the necessary functionalities of a real time web app for communicating using web browsers.

Each user can create a room or join an existing room.
Each guest in the room can join the speakers board by sending a join request to the Admin of the room.

- features:
  - Node provides the backend environment for this application
  - Express middleware is used to handle requests, routes
  - Mongoose schemas to model the application data
  - React for displaying UI components
  - Redux to manage application's state
  - WebRTC is used for realtime communication between browsers
  - Socket.io is used for realtime communication of server and end users
  - Authentication is handled using JWT and refresh token method
  - Twilio is used for OTP service
  - Docker is used for Containerization

## Setup

```
 Create .env file in client that includes:

  * REACT_APP_BASE_URL=                     // i.e --> "http://localhost:5000"

 Create .env file in server that includes:

  * PORT=                     // 5000
  * BASE_URL=                 // http://localhost:5000
  * OTP_HASH_SECRET=
  * TWILIO_ACCOUNT_SID=
  * TWILIO_TOKEN=
  * TWILIO_FROM_NUMBER=
  * JWT_SECRET=


```

## Start development in both server and client

```
$ npm run start
```

## Simple build for production in client

```
$ npm run build
```

## Languages & tools

- [Node](https://nodejs.org/en/)

- [Express](https://expressjs.com/)

- [Mongoose](https://mongoosejs.com/)

- [React](https://reactjs.org/)

- [Redux](https://redux.js.org/)

- [Socket.io](https://socket.io/)

- [webRTC](https://webrtc.org/)

- [Twilio](https://www.twilio.com/)

- [Docker](https://www.docker.com/)

## Screenshots

![Screenshot from 2023-02-01 02-14-08](https://user-images.githubusercontent.com/57313413/215889984-5b4cb7e2-100b-44cf-8ae3-1b08a418b058.png)

![Screenshot from 2023-02-01 02-14-24](https://user-images.githubusercontent.com/57313413/215890338-06ad1619-00e0-4b17-9510-56fe975ca458.png)

![Screenshot from 2023-02-01 02-14-54](https://user-images.githubusercontent.com/57313413/215890400-f7636697-9a65-4f55-bfa3-a8bb1aa72037.png)

![Screenshot from 2023-02-01 02-15-50](https://user-images.githubusercontent.com/57313413/215890478-89d76877-3858-4fcb-8ce8-54ee8956a603.png)

![Screenshot from 2023-02-01 02-17-16](https://user-images.githubusercontent.com/57313413/215890544-0c517811-499f-4131-a727-75e33b144cc2.png)

![Screenshot from 2023-02-01 02-36-46](https://user-images.githubusercontent.com/57313413/215890598-50e0559e-2a6e-4fcf-ab5a-5ed5f1104056.png)

![Screenshot from 2023-02-01 02-57-15](https://user-images.githubusercontent.com/57313413/215890642-cd8ac356-9dc3-4a7f-8b63-1ea2ed0dbf5f.png)

![Screenshot from 2023-02-01 02-57-41](https://user-images.githubusercontent.com/57313413/215890675-819321ad-6c51-4e6f-949e-848cf8ec8afd.png)

![Screenshot from 2023-02-01 02-57-52](https://user-images.githubusercontent.com/57313413/215890712-cf52612f-2fc7-458c-85c5-862b62d86055.png)
