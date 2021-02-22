import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
  Resolver,
  Arg,
  Mutation,
  InputType,
  Field,
  Int,
  Ctx,
  ObjectType,
} from 'type-graphql';
import { MaxLength, Length, Min, Max, MinLength } from 'class-validator';
import { PrismaClient } from '@prisma/client';
import { User } from '@generated/type-graphql';

@InputType()
class NewUserInput {
  @Field()
  @MaxLength(30)
  name!: string;

  @Field()
  @Length(1, 255)
  email!: string;

  @Field(type => Int, { nullable: true })
  @Min(1)
  @Max(99)
  age?: number;

  @Field()
  @MinLength(6, {
    message: 'Password Too Short',
  })
  @MaxLength(12, {
    message: 'Password Too Long',
  })
  password!: string;
}

@InputType()
class UpdateUserInput {
  @Field()
  @MaxLength(30)
  name?: string;

  @Field()
  @Length(1, 255)
  email?: string;

  @Field(type => Int, { nullable: true })
  @Min(1)
  @Max(99)
  age?: number;
}

@ObjectType()
class CreateUserResponse {
  @Field()
  user!: User;

  @Field()
  token!: string;
}

@Resolver(of => User)
class UserMutationResolver {
  @Mutation(returns => CreateUserResponse)
  async createUser(
    @Arg('data') newUserData: NewUserInput,
    @Ctx('prisma') prisma: PrismaClient,
  ) {
    const { password, ...userData } = newUserData;
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPass,
      },
    });
    return {
      user,
      token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET!),
    };
  }

  @Mutation(returns => User)
  async updateUser(
    @Arg('id') userId: number,
    @Arg('data') updateData: UpdateUserInput,
    @Ctx('prisma') prisma: PrismaClient,
  ) {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...updateData,
      },
    });
    return user;
  }

  @Mutation(returns => User)
  async deleteUser(
    @Arg('id') userId: number,
    @Ctx('prisma') prisma: PrismaClient,
  ) {
    const user = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return user;
  }
}

export default UserMutationResolver;
