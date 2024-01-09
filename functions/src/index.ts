import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
// Start writing functions
// https://firebase.google.com/docs/functions/typescript


// Initialize Firebase Admin SDK
admin.initializeApp();

type User = {
  first_name: string;
  last_name: string;
  age: number;
  id: string;
}

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});


export const getAllUsers = onRequest(async (request, response) => {
  try {
    const usersRef = admin.firestore().collection('users'); 
    // get all users from firestore
    const snapshot = await usersRef.get();
    const users: User[] = [];

    snapshot.forEach(doc => {
      const userData = doc.data() as User;
      const userWithId = { ...userData, id: doc.id };
      users.push(userWithId);
    });

    // render custom html
    users.forEach(user => {
      html += `<tr><td>${user.id}</td><td>${user.first_name}</td><td>${user.last_name}</td><td>${user.age}</td></tr>`;
    });

    html += `
      </table>
    </body>
    </html>`;

    response.status(200).send(html);
  } catch (error) {
    logger.error("Error getting users", error);
    response.status(500).send("Internal Server Error");
  }
});



let html = `
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #121212;
      color: #fff;
      margin: 0;
      padding: 20px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 20px;
    }
    th, td {
      text-align: left;
      padding: 8px;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #232323;
    }
    tr:nth-child(even) {
      background-color: #181818;
    }
  </style>
</head>
<body>
  <h2>Users List</h2>
  <table>
    <tr><th>ID</th><th>First Name</th><th>Last Name</th><th>Age</th></tr>`;
