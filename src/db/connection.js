import { connect, connection } from 'mongoose';
import dotenv from 'dotenv';
import { bold } from 'chalk';

dotenv.config();

const connected = bold.cyan;
const error = bold.yellow;
const disconnected = bold.red;
const termination = bold.magenta;

const { MONGODB_URI } = process.env;

connection.on('connected', () => {
  console.log(
    connected('Mongoose default connection is open to ', MONGODB_URI),
  );
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
    MONGODB_URI,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useMongoClient: true,
    },
  );

export default dbconnect;
