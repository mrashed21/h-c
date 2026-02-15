import { JwtPayload, SignOptions } from "jsonwebtoken";
import { config } from "../config/config";
import { jwtUtils } from "./jwt";

const getAccessToken = (payload: JwtPayload) => {
  const token = jwtUtils.createToken(payload, config.ACCESS_TOKEN_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRES_IN,
  } as SignOptions);
  return token;
};

const getRefreshToken = (payload: JwtPayload) => {
  const token = jwtUtils.createToken(payload, config.REFRESH_TOKEN_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRES_IN,
  } as SignOptions);
  return token;
};

export const tokenUtils = {
  getAccessToken,
  getRefreshToken,
};
