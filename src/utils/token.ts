import { Response } from "express";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import { config } from "../config/config";
import { cookieUtils } from "./cookie";
import { jwtUtils } from "./jwt";

// !get access token fun
const getAccessToken = (payload: JwtPayload) => {
  const token = jwtUtils.createToken(payload, config.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  } as SignOptions);
  return token;
};

// !get refresh token fun
const getRefreshToken = (payload: JwtPayload) => {
  const token = jwtUtils.createToken(payload, config.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  } as SignOptions);
  return token;
};

// !create access token and set cookie fun
const createAccessTokenAndSetCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    // secure: config.NODE_ENV === "production",
    secure: true,
    sameSite: "none",
    path: "/",
    // 1 day
    maxAge: 1000 * 60 * 60 * 24,
  });
};

// !create refresh token and set cookie fun
const createRefreshTokenAndSetCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    // secure: config.NODE_ENV === "production",
    secure: true,
    sameSite: "none",
    path: "/",
    // 7 days
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
};

// !set better auth cookie fun
const setBetterAuthCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    // secure: config.NODE_ENV === "production",
    secure: true,
    sameSite: "none",
    path: "/",
    // 1 day
    maxAge: 1000 * 60 * 60 * 24,
  });
};

export const tokenUtils = {
  getAccessToken,
  getRefreshToken,
  createAccessTokenAndSetCookie,
  createRefreshTokenAndSetCookie,
  setBetterAuthCookie,
};
