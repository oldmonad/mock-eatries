import moment from 'moment';
import User from '../models/user.model';
import {
  errorResponse,
  successResponse,
  hashPassword,
  generateToken,
  comparePassword,
  excludeProperty,
} from '../utils/helpers';

import client from '../db/redis';

/**
 * Create A User
 * @param {object} req
 * @param {object} res
 * @returns {object} user object
 */
export async function signup(req, res) {
  const { name, email, password } = req.body;

  const isUserExists = await User.findOne({ email });

  if (isUserExists) {
    return errorResponse(res, 409, 'This user already exists');
  }

  const hashedPassword = await hashPassword(password);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  const user = await newUser.save();
  const userJSON = user.toJSON();
  const { _id } = user;
  const token = generateToken({ sub: _id });

  const creatededUser = excludeProperty(userJSON, [
    'password',
    '__v',
    '_id',
    'admin',
    'date',
  ]);
  creatededUser.token = token;

  const rateData = {
    count: 1,
    startTime: moment().unix(),
  };

  client.set(_id.toString(), JSON.stringify(rateData), 'EX', 3600);

  return successResponse(
    res,
    201,
    'You have successfully created an account',
    creatededUser,
  );
}

/**
 * Login a User
 * @param {object} req
 * @param {object} res
 * @returns {object} login response
 */
export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return errorResponse(res, 404, 'The email or password is not correct');
  }

  if (!comparePassword(user.password, password)) {
    return errorResponse(res, 404, 'The email or password is not correct');
  }

  const { _id } = user;

  const token = generateToken({ sub: _id });

  const userJSON = user.toJSON();

  const authenticatedUser = excludeProperty(userJSON, [
    'password',
    '__v',
    '_id',
    'admin',
    'date',
  ]);

  authenticatedUser.token = token;

  const rateData = {
    count: 1,
    startTime: moment().unix(),
  };

  client.set(_id.toString(), JSON.stringify(rateData), 'EX', 3600);

  return successResponse(
    res,
    200,
    'You have successfully logged in',
    authenticatedUser,
  );
}
