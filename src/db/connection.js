//require mongoose module
import { connect, connection } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

//require chalk module to give colors to console text
import { bold } from 'chalk';

const connected = bold.cyan;
const error = bold.yellow;
const disconnected = bold.red;
const termination = bold.magenta;

const dbURL =
  process.env.NODE_ENV === 'test'
    ? process.env.MONGO_URI_TEST
    : process.env.MONGO_URI;

//export this function and imported by server.js
const dbconnect = () => {
  connect(
    dbURL,
    { useNewUrlParser: true, useUnifiedTopology: true },
  );

  connection.on('connected', () => {
    console.log(connected('Mongoose default connection is open to ', dbURL));
  });

  connection.on('error', err => {
    console.log(
      error('Mongoose default connection has occured ' + err + ' error'),
    );
  });

  connection.on('disconnected', () => {
    console.log(disconnected('Mongoose default connection is disconnected'));
  });

  process.on('SIGINT', () => {
    connection.close(() => {
      console.log(
        termination(
          'Mongoose default connection is disconnected due to application termination',
        ),
      );
      process.exit(0);
    });
  });
};

export default dbconnect;
