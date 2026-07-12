import type { Role } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";

interface RegisterParams {
  name: string;
  email: string;
  password: string;
  role: Role;
}

interface LoginParams {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: Date;
  };
  token: string;
}

export class AuthService {
  /**
   * Register a new user.
   * - Checks for duplicate email
   * - Hashes the password
   * - Creates the user in the database
   * - Returns user data (without password) and a signed JWT
   */
  async register(params: RegisterParams): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: params.email },
    });

    if (existingUser) {
      throw new AppError("A user with this email already exists.", 409);
    }

    const hashedPassword = await hashPassword(params.password);

    const user = await prisma.user.create({
      data: {
        name: params.name,
        email: params.email,
        password: hashedPassword,
        role: params.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  /**
   * Authenticate a user with email and password.
   * - Verifies the user exists
   * - Compares the password against the stored hash
   * - Returns user data (without password) and a signed JWT
   */
  async login(params: LoginParams): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: params.email },
    });

    if (!user) {
      throw new AppError("Invalid email or password.", 401);
    }

    const isPasswordValid = await comparePassword(params.password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password.", 401);
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Retrieve the current authenticated user's profile.
   */
  async getProfile(userId: string): Promise<Omit<AuthResponse["user"], never>> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    return user;
  }
}

export const authService = new AuthService();
