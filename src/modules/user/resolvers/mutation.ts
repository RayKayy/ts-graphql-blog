import { inject, singleton } from 'tsyringe';
import {
  Resolver,
  Arg,
  Mutation,
  InputType,
  Field,
  Int,
  Ctx,
} from 'type-graphql';
import { MaxLength, Length, Min, Max } from 'class-validator';
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

@singleton()
@Resolver(of => User)
class UserMutationResolver {
  @Mutation(returns => User)
  async createUser(
    @Arg('data') newUserData: NewUserInput,
    @Ctx('prisma') prisma: PrismaClient,
  ) {
    const user = await prisma.user.create({
      data: {
        ...newUserData,
      },
    });
    return user;
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
