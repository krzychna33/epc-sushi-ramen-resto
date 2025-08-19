import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { Category } from '@categories/Category';
import { CategoriesRepository } from '@categories/db/categories.repository';
import { CreateCategoryDto } from '@categories/dto/create-category.dto';

@Injectable()
export class CategoriesService {
  public constructor(
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  public getCategories(): Promise<Category[]> {
    return this.categoriesRepository.find({});
  }

  public async categoryExists(id: string): Promise<boolean> {
    const category = await this.categoriesRepository.findOneById(id);
    return !!category;
  }

  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    try {
      const category = Category.create({ name: dto.name });

      await this.categoriesRepository.create(category);

      return category;
    } catch (e) {
      if (e instanceof MongoServerError && e.code === 11000) {
        throw new ConflictException('Category already exists');
      }
      throw new InternalServerErrorException();
    }
  }
}
