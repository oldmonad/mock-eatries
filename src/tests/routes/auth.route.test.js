import request from 'supertest';
import app from '../../server';
import baseUrl from '../utils/constants';
import { signUpMock, loginMock, invalidLoginMock } from '../mocks/mockUsers';

import User from '../../models/user.model';

beforeAll(async () => {
  jest.setTimeout(10000);
  await User.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
});

describe('TEST SUITE FOR USER SIGNUP', () => {
  it('should successfully sign up a user', async () => {
    const res = await request(app)
      .post(`${baseUrl}/auth/signup`)
      .send(signUpMock);
    expect(res.status).toEqual(201);
    expect(res.body.status).toEqual('success');
    expect(res.body.message).toEqual(
      'You have successfully created an account',
    );
    expect(res.body.data.email).toEqual(signUpMock.email);
  });

  it('should not signup a user with the same email', async () => {
    const res = await request(app)
      .post(`${baseUrl}/auth/signup`)
      .send(signUpMock);
    expect(res.status).toEqual(409);
    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual('This user already exists');
  });
});

describe('TEST SUITE FOR USER LOGIN', () => {
  it('should successfully sign in a user', async () => {
    const res = await request(app)
      .post(`${baseUrl}/auth/login`)
      .send(loginMock);
    expect(res.status).toEqual(200);
    expect(res.body.status).toEqual('success');
    expect(res.body.message).toEqual('You have successfully logged in');
    expect(res.body.data.email).toEqual(loginMock.email);
  });

  it('should not sign in a non-existing user', async () => {
    const res = await request(app)
      .post(`${baseUrl}/auth/login`)
      .send(invalidLoginMock);
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual('The email or password is not correct');
  });
});
