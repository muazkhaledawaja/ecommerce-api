/* eslint-disable prettier/prettier */
import { Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryPhoto } from './models/categories-photos.entity';
import { Repository } from 'typeorm';
import { LocalFilesService } from '../../../local-files/local-files.service';
import { NotFoundError } from '../../../errors/not-found.error';
import { Category } from '../models/category.entity';

@Injectable()
export class CategoryPhotosService {
  constructor(
    @InjectRepository(Category) private categorysRepository: Repository<Category>,
    @InjectRepository(CategoryPhoto)
    private categoryPhotosRepository: Repository<CategoryPhoto>,
    private localFilesService: LocalFilesService,
  ) {}

  async getCategoryPhotos(): Promise<CategoryPhoto[]> {
    return this.categoryPhotosRepository.find({
      relations: ['category'],
    });
  }

  async getCategoryPhoto(
    categoryId: number,
    photoId: number,
    thumbnail: boolean,
  ): Promise<StreamableFile> {
    const categoryPhoto = await this.categoryPhotosRepository.findOne({
      where: { id: photoId, category: { id: categoryId } },
    });
    if (!categoryPhoto) {
      throw new NotFoundError('category photo', 'id', photoId.toString());
    }
    const filepath = thumbnail ? categoryPhoto.thumbnailPath : categoryPhoto.path;
    const mimeType = thumbnail ? 'image/jpeg' : categoryPhoto.mimeType;
    return await this.localFilesService.getPhoto(filepath, mimeType);
  }

  async createCategoryPhoto(
    id: number,
    path: string,
    mimeType: string,
  ): Promise<CategoryPhoto> {
    const category = await this.categorysRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundError('category', 'id', id.toString());
    }
    const photo = new CategoryPhoto();
    photo.path = path;
    photo.mimeType = mimeType;
    photo.thumbnailPath = await this.localFilesService.createPhotoThumbnail(
      photo.path,
    );
    photo.placeholderBase64 =
      await this.localFilesService.createPhotoPlaceholder(photo.path);
    category.photos.push(photo);
    await this.categorysRepository.save(category);
    if (category.photosOrder) {
      category.photosOrder = [...category.photosOrder.split(','), photo.id].join(
        ',',
      );
    } else {
      category.photosOrder = photo.id?.toString();
    }
    await this.categorysRepository.save(category);
    return photo;
  }

  async addCategoryPhoto(
    id: number,
    file: Express.Multer.File,
  ): Promise<Category> {
    const category = await this.categorysRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundError('category', 'id', id.toString());
    }
    const photo = new CategoryPhoto();
    const { path, mimeType } = await this.localFilesService.savePhoto(file);
    photo.path = path;
    photo.mimeType = mimeType;
    photo.thumbnailPath = await this.localFilesService.createPhotoThumbnail(
      file.path,
    );
    photo.placeholderBase64 =
      await this.localFilesService.createPhotoPlaceholder(file.path);
    category.photos.push(photo);
    await this.categorysRepository.save(category);
    if (category.photosOrder) {
      category.photosOrder = [...category.photosOrder.split(','), photo.id].join(
        ',',
      );
    } else {
      category.photosOrder = photo.id?.toString();
    }
    return this.categorysRepository.save(category);
  }

  async deleteCategoryPhoto(id: number, photoId: number): Promise<Category> {
    const category = await this.categorysRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundError('category', 'id', id.toString());
    }
    category.photos = category.photos.filter((p) => p.id !== photoId);
    await this.categorysRepository.save(category);
    if (category.photosOrder) {
      category.photosOrder = category.photosOrder
        .split(',')
        .filter((p) => p !== photoId.toString())
        .join(',');
    }
    return this.categorysRepository.save(category);
  }
}
