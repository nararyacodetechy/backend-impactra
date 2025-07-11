import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListPostCategory } from './entity/type-post-categories.entity';

@Controller('type-post-categories')
export class ListPostCategoryController {
  constructor(
    @InjectRepository(ListPostCategory)
    private listCategoryRepo: Repository<ListPostCategory>
  ) {}

  @Get()
  async getAllTemplates() {
    const data = await this.listCategoryRepo.find({ order: { created_at: 'DESC' } });
    return {
      status: 'success',
      data: data.map((tpl) => ({
        id: tpl.id,
        uuid: tpl.uuid,
        name: tpl.name,
        description: tpl.description,
        created_at: tpl.created_at
      }))
    };
  }

}
