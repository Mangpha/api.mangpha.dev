import { InternalServerErrorOutput } from 'src/common/common.error';
import { CustomRepository } from 'src/typeorm/custom.decorator';
import { Repository } from 'typeorm';
import { FindByIdInput, FindByIdOutput } from '../dtos/findById.dto';
import { User } from '../entities/user.entity';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  /**
   * Return User Data with Post Relation
   */
  async findById({ id }: FindByIdInput): Promise<FindByIdOutput> {
    try {
      const user = await this.findOne({
        where: { id },
        relations: ['posts'],
      });
      if (!user) return { success: false, error: 'User Not Found' };
      return { success: true, user };
    } catch (e) {
      console.log(e);
      return InternalServerErrorOutput;
    }
  }
}
