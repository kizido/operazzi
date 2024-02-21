import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import "dotenv/config";
import env from "../util/validateEnv";
import { randomBytes } from "crypto";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.session.userId)
      .select("+email")
      .exec();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

interface SignUpBody {
  username?: string;
  email?: string;
  password?: string;
}

export const signUp: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const passwordRaw = req.body.password;

  try {
    if (!username || !email || !passwordRaw) {
      throw createHttpError(400, "Parameters missing");
    }

    const existingUsername = await UserModel.findOne({
      username: username,
    }).exec();

    if (existingUsername) {
      throw createHttpError(409, "Username has already been taken.");
    }

    const existingEmail = await UserModel.findOne({ email: email }).exec();

    if (existingEmail) {
      throw createHttpError(409, "Email has already been used.");
    }

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const verificationToken = generateVerificationToken();

    const newUser = await UserModel.create({
      username: username,
      email: email,
      password: passwordHashed,
      emailVerificationToken: verificationToken,
    });

    await newUser.save();

    const verificationUrl = process.env.NODE_ENV === 'production' ? `https://operazzi-api-production.up.railway.app/api/users/verify-email?token=${verificationToken}` : `http://localhost:5000/api/users/verify-email?token=${verificationToken}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "kieranphillipking@gmail.com",
        pass: env.EMAIL_SECRET,
      },
    });

    await transporter.sendMail({
      from: "kieranphillipking@gmail.com",
      to: email,
      subject: "Email Verification",
      html: `Please click this link to verify your email: <a href="${verificationUrl}">Click this link to verify your email!</a>`,
    });

    // req.session.userId = newUser._id;

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail: RequestHandler = async (req, res, next) => {
  try {
    const { token } = req.query; // Assuming you're sending the token as a query parameter

    const user = await UserModel.findOne({
      emailVerificationToken: token,
    }).exec();

    if (!user) {
      throw createHttpError(400, "Invalid or expired verification token.");
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined; // Clear the token after verification
    await user.save();

    // res.status(200).json({ message: "Email verified successfully." });
    res.redirect(process.env.NODE_ENV === 'production' ? 'https://operazzi-production.up.railway.app/verification-successful' : 'http://localhost:3000/verification-successful')
  } catch (error) {
    res.redirect(process.env.NODE_ENV === 'production' ? 'https://operazzi-production.up.railway.app/verification-failed' : 'http://localhost:3000/verification-failed')
    next(error);
  }
};

interface LoginBody {
  username?: string;
  password?: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username || !password) {
      throw createHttpError(400, "Parameters missing");
    }

    const user = await UserModel.findOne({ username: username })
      .select("+password +email")
      .exec();

    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }
    if(!user.emailVerified) {
      throw createHttpError(401, "Email not yet verified");
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw createHttpError(401, "Invalid credentials");
    }

    req.session.userId = user._id;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(200);
    }
  });
};

const generateVerificationToken = () => {
  return randomBytes(32).toString("hex");
};
