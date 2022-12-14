import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/roles.decorator';
import { UserData } from 'src/auth/userData.decorator';
import { ChangeRoleInput, ChangeRoleOutput } from './dtos/changeRole.dto';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/createAccount.dto';
import { DeleteAccountOutput } from './dtos/deleteAccount.dto';
import { EditAccountInput, EditAccountOutput } from './dtos/editAccount.dto';
import { FindByIdInput, FindByIdOutput } from './dtos/findById.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation((returns) => CreateAccountOutput)
  createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.userService.createAccount(createAccountInput);
  }

  @Mutation((returns) => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.userService.login(loginInput);
  }

  @Roles('Any')
  @Query((returns) => User)
  myData(@UserData() user: User) {
    return user;
  }

  @Roles('Any')
  @Mutation((returns) => EditAccountOutput)
  editAccount(
    @UserData() user: User,
    @Args('input') editAccountInput: EditAccountInput,
  ): Promise<EditAccountOutput> {
    return this.userService.editAccount(user.id, editAccountInput);
  }

  @Roles('Any')
  @Mutation((returns) => DeleteAccountOutput)
  deleteAccount(@UserData() user: User): Promise<DeleteAccountOutput> {
    return this.userService.deleteAccount(user.id);
  }

  @Query((returns) => FindByIdOutput)
  findUserById(
    @Args('input') findByIdInput: FindByIdInput,
  ): Promise<FindByIdOutput> {
    return this.userService.findById(findByIdInput);
  }

  @Roles('Any')
  @Mutation((returns) => ChangeRoleOutput)
  changeRole(
    @UserData() user: User,
    @Args('input') changeRoleInput: ChangeRoleInput,
  ): Promise<ChangeRoleOutput> {
    return this.userService.changeRole(user.id, changeRoleInput);
  }
}
