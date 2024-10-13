import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createUser(request: CreateUserRequestDto) {
    try {
      return await this.prismaService.user.create({
        data: {
          email: request.email,
          password: await bcrypt.hash(request.password, 10),
        },
        // just return email and id
        select: {
          email: true,
          id: true,
        },
      });
    } catch (err) {
      // eig keine best practise
      if (err.code === 'P2002') {
        throw new UnprocessableEntityException('Email already exists');
      }

      throw err;
    }
  }

  async getUser(filter: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: filter,
    });
  }
}
