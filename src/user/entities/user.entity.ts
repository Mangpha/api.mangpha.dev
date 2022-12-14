import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsBoolean, IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { CommonEntity } from 'src/common/entity/common.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { InternalServerErrorException } from '@nestjs/common';
import { Post } from 'src/post/entities/post.entity';

export enum UserRoles {
  Admin = 'Admin',
  User = 'User',
  Guest = 'Guest',
}

registerEnumType(UserRoles, { name: 'UserRoles' });

@Entity()
@InputType('UserInputType', { isAbstract: true })
@ObjectType()
export class User extends CommonEntity {
  @Column({ unique: true })
  @Field((type) => String)
  @IsString()
  @Length(2)
  username: string;

  @Column({ select: false })
  @Field((type) => String)
  @IsString()
  @Length(8)
  password: string;

  @Column({ unique: true })
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.Guest })
  @Field((type) => UserRoles, { defaultValue: UserRoles.Guest })
  @IsEnum(UserRoles)
  role?: UserRoles;

  @Column({ default: false })
  @Field((type) => Boolean)
  @IsBoolean()
  verified: boolean;

  @OneToMany((type) => Post, (post) => post.author)
  @Field((type) => [Post], { nullable: true })
  posts: Post[];

  @BeforeInsert()
  @BeforeUpdate()
  async cryptPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch {
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(userPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(userPassword, this.password);
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
