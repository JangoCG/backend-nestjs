import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { TokenPayload } from "../token-payload.interface";
import { UserService } from "../../user/user.service";
import { User } from "@prisma/client";

/**
 * JWT authentication strategy for Passport.js implementation in NestJS.
 * Extracts and validates JWT tokens from either HTTP cookies or Authorization header.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates an instance of JwtStrategy.
   * Configures the strategy with JWT secret and token extraction methods.
   *
   * @param {ConfigService} configService - NestJS config service for accessing environment variables
   * @param {UserService} userService - Service for user-related operations
   * @throws {Error} If JWT_ACCESS_TOKEN_SECRET is not found in environment variables
   */
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      /**
       * Secret key used for verifying the JWT signature.
       * Retrieved from environment variables.
       */
      secretOrKey: configService.getOrThrow("JWT_ACCESS_TOKEN_SECRET"),

      /**
       * JWT token extraction configuration.
       * Attempts to extract the token in the following order:
       * 1. From the 'Authentication' cookie
       * 2. From the Authorization header as a Bearer token
       *
       * @example
       * // Cookie format
       * Authentication=<jwt_token>
       *
       * // Authorization header format
       * Authorization: Bearer <jwt_token>
       */
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.Authentication,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
    });
  }

  /**
   * Validates the JWT payload and retrieves the corresponding user.
   * Called by Passport.js after token is verified.
   *
   * @param {TokenPayload} payload - Decoded JWT token payload containing user information
   * @returns {Promise<User>} Promise resolving to the authenticated user
   *
   * @example
   * // Example payload structure
   * {
   *   userId: "123",
   *   // ... other payload properties
   * }
   */
  async validate(payload: TokenPayload): Promise<User> {
    return this.userService.getUser({ id: payload.userId });
  }
}
