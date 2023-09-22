import { Module } from '@nestjs/common';
import { CategoryPhotosService } from './categories-photos.service';
import { CategoryPhotosController } from './categories-photos.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalFilesModule } from '../../../local-files/local-files.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../models/category.entity';
import { CategoryPhoto } from './models/categories-photos.entity';
import { CategoryPhotosExporter } from './categories-photos.exporter';
import { CategoryPhotosImporter } from './categories-photos.importer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, CategoryPhoto]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>('uploadPath'),
      }),
      inject: [ConfigService],
    }),
    LocalFilesModule,
  ],
  providers: [
    CategoryPhotosService,
    CategoryPhotosExporter,
    CategoryPhotosImporter,
  ],
  controllers: [CategoryPhotosController],
  exports: [CategoryPhotosExporter, CategoryPhotosImporter],
})
export class CategoryPhotosModule {}
