import { connect, connection } from 'mongoose';
import dotenv from 'dotenv';
import { bold } from 'chalk';

dotenv.config();

const connected = bold.cyan;
const error = bold.yellow;
const disconnected = bold.red;
const termination = bold.magenta;

const dbURL =
  process.env.NODE_ENV === 'test'
    ? process.env.MONGO_URI_TEST
    : process.env.MONGO_URI;

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

const dbconnect = () =>
  connect(
    dbURL,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
  );

export default dbconnect;
