import { Module } from '@nestjs/common';
import { TypeOrmCustomModule } from 'src/typeorm/custom.module';
import { PostResolver } from './post.resolver';
import { CategoryRepository } from './repositories/category.repository';
import { PostRepository } from './repositories/post.repository';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmCustomModule.forCustomRepository([
      PostRepository,
      CategoryRepository,
    ]),
  ],
  providers: [PostResolver, PostService],
})
export class PostModule {}