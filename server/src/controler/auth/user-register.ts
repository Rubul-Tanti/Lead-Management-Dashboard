import { Request, Response } from "express"

import { registerUserSchema } from "../../utils/validation/userValidation"
import { hashPassword } from "../../utils/hashPassword"
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken"

import logger from "../../utils/logger"

import { IUser, User } from "../../db/userSchema"
import { Otp } from "../../db/otpSchema"

export const getsafeUser=(user:IUser)=>{
return {
                email:user.email,
                profilePicture:user.profilePicture,
                role:user.role,
                id:user._id,
                phoneNumber:user.phoneNumber,
                userName:user.userName,
            }
}

const registerUser = async (
  req: Request,
  res: Response
) => {
  logger.info("hit register user")

  try {
    const validationResult =
      registerUserSchema.safeParse(req.body)

    if (!validationResult.success) {
      logger.error(
        "validation failed at register user",
        req.body
      )

      return res.status(400).json({
        success: false,
        message: validationResult.error.flatten(),
      })
    }

    const {
      email,
      password,
      otp,
      userName,
    } = validationResult.data

    // Check existing user
    const userAlreadyExist = await User.findOne({
      email,
    })

    if (userAlreadyExist) {
      logger.warn("user already exist")

      return res.status(400).json({
        success: false,
        message: "user already exist",
      })
    }

    // Verify OTP
    const otpObj = await Otp.findOne({
      email,
      otp,
    })

    if (!otpObj) {
      return res.status(402).json({
        success: false,
        message: "otp does not match",
      })
    }

    // Check OTP expiration
    const now = Date.now()

    const createdAt =
      otpObj.createdAt.getTime()

    const remainingTime =
      (now - createdAt) / 1000 / 60

    if (remainingTime > 5) {
      await Otp.deleteMany({ email })

      return res.status(402).json({
        success: false,
        message:
          "otp expired, please try again later",
      })
    }

    // Hash password
    const hashedPassword =
      await hashPassword(password)

    // Create user
    const newUser = await User.create({
      email,
      userName,
      password: hashedPassword,
    })

    logger.info("new user created", {
      id: newUser._id,
      email: newUser.email,
    })

    // Delete OTP after successful registration
    await Otp.deleteMany({ email })

    // Generate tokens
    const access_token =
      await generateAccessToken(
        newUser._id.toString()
      )

    const refresh_token =
      await generateRefreshToken(
        newUser._id.toString()
      )

    return res
      .status(200)
      .cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: true,
      })
      .json({
        success: true,
        message: "user created successfully",
        data: getsafeUser(newUser),
        access_token,
      })
  } catch (e) {
    logger.error("error registering user", e)

    return res.status(500).json({
      success: false,
      message: "internal server error",
    })
  }
}

export default registerUser