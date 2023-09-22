/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './models/category.entity';
import { CategoryGroup } from './models/category-group.entity';
import { ProductsModule } from '../products/products.module';
import { CategoriesExporter } from './categories.exporter';
import { CategoriesImporter } from './categories.importer';
import { CategoryPhotosModule } from './categories-photos/categories-photos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, CategoryGroup]),
    ProductsModule,
    CategoryPhotosModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesExporter, CategoriesImporter],
  exports: [
    CategoriesExporter,
    CategoriesImporter,
    CategoriesService,
    CategoryPhotosModule],
})
export class CategoriesModule { }
