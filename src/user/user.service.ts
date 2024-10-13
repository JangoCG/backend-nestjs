import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { CreateUserRequestDto } from "./dto/create-user-request.dto";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, User } from "@prisma/client";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  /**
   * Creates a new user
   * @param request
   */
  async createUser(request: CreateUserRequestDto) {
    try {
      return await this.prismaService.user.create({
        data: {
          email: request.email,
          password: await bcrypt.hash(request.password, 10),
        },
        // just return email and id (so the response will not contain the password)
        select: {
          email: true,
          id: true,
        },
      });
    } catch (err) {
      // TODO: We should not expose this information
      if (err.code === "P2002") {
        throw new UnprocessableEntityException("Email already exists");
      }
      throw err;
    }
  }

  /**
   * Gets a user by the filter
   * @param filter The filter to find the user
   */
  async getUser(filter: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: filter,
    });
  }

  /**
   * Updates a user
   * @param filter The filter to find the user
   * @param data The data to update
   */
  async updateUser(
    filter: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User | null> {
    return this.prismaService.user.update({
      where: filter,
      data,
    });
  }

  /**
   * Gets or creates a user
   * @param data The data to create the user
   */
  async getOrCreateUser(data: CreateUserRequestDto) {
    const user = await this.getUser({ email: data.email });

    if (user) {
      return user;
    } else {
      return this.createUser(data);
    }
  }
}
