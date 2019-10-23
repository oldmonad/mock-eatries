import request from 'supertest';
import app from '../../server';
import baseUrl from '../utils/constants';
import { signUpMock, loginMock, invalidLoginMock } from '../mocks/mockUsers';

import User from '../../models/user.model';
import client from '../../db/redis';
import mongoose from 'mongoose';

const db = 'mongodb://127.0.0.1/mock-eatries-test';

describe('TEST SUITE FOR USER SIGNUP', () => {
  beforeAll(async done => {
    jest.setTimeout(10000);
    await mongoose.connect(
      db,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
      err => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      },
    );
    await User.deleteMany({});
    done();
  });

  afterAll(async done => {
    await User.deleteMany({});
    await mongoose.connection.close();
    client.unref();
    done();
  });

  it('should successfully sign up a user', async done => {
    const res = await request(app)
      .post(`${baseUrl}/auth/signup`)
      .send(signUpMock);
    expect(res.status).toEqual(201);
    expect(res.body.status).toEqual('success');
    expect(res.body.message).toEqual(
      'You have successfully created an account',
    );
    expect(res.body.data.email).toEqual(signUpMock.email);
    done();
  });

  it('should not signup a user with the same email', async done => {
    const res = await request(app)
      .post(`${baseUrl}/auth/signup`)
      .send(signUpMock);
    expect(res.status).toEqual(409);
    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual('This user already exists');
    done();
  });

  it('should successfully sign in a user', async done => {
    const res = await request(app)
      .post(`${baseUrl}/auth/login`)
      .send(loginMock);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual('success');
    expect(res.body.message).toEqual('You have successfully logged in');
    expect(res.body.data.email).toEqual(loginMock.email);
    done();
  });

  it('should not sign in a non-existing user', async done => {
    const res = await request(app)
      .post(`${baseUrl}/auth/login`)
      .send(invalidLoginMock);
    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual('The email or password is not correct');
    done();
  });

  it('should successfully sign in a user', async done => {
    const res = await request(app)
      .post(`${baseUrl}/auth/login`)
      .send(loginMock);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual('success');
    expect(res.body.message).toEqual('You have successfully logged in');
    expect(res.body.data.email).toEqual(loginMock.email);
    done();
  });

  it('should not sign in a non-existing user', async done => {
    const res = await request(app)
      .post(`${baseUrl}/auth/login`)
      .send(invalidLoginMock);
    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual('The email or password is not correct');
    done();
  });
});
