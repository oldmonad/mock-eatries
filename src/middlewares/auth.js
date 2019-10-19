import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { errorResponse, verifyToken } from '../util/helpers';
dotenv.config();

/**
 *
 *
 * @export
 * @param {object} req
 * @param {object} res
 * @param {void} next
 * @returns {void}
 */
export async function checkAuthorizedUser(req, res, next) {
  const token = req.headers.authorization || req.headers['x-access-token'];
  if (!token) {
    return errorResponse(res, 401, 'Please provide a JWT token');
  }
  req.user = await verifyToken(token, process.env.SECRET_KEY);
  if (!req.user) {
    return errorResponse(
      res,
      400,
      'Token is invalid, please provide a valid token',
    );
  }
  try {
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
}

/**
 *
 *
 * @export
 * @param {object} req
 * @param {object} res
 * @param {void} next
 * @returns {void}
 */
export function adminAuth(req, res, next) {
  const { admin } = req.user;

  if (!admin) {
    return errorResponse(
      res,
      401,
      'You are not authorized to make this action',
    );
  }
  next();
}
