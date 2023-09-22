import { Injectable } from '@nestjs/common';
import { CategoryPhoto } from './models/categories-photos.entity';
import { CategoryPhotosService } from './categories-photos.service';
import { Exporter } from '../../../import-export/models/exporter.interface';
import * as mime from 'mime-types';

@Injectable()
export class CategoryPhotosExporter implements Exporter<CategoryPhoto> {
  constructor(private categoryPhotosService: CategoryPhotosService) {}

  async export(): Promise<CategoryPhoto[]> {
    const categoryPhotos = await this.categoryPhotosService.getCategoryPhotos();
    categoryPhotos.sort((a, b) => {
      if (a.category.id !== b.category.id) {
        return a.category.id - b.category.id;
      }
      const photosOrder = a.category.photosOrder.split(',');
      return (
        photosOrder.indexOf(a.id.toString()) -
        photosOrder.indexOf(b.id.toString())
      );
    });
    const preparedCategoryPhotos: CategoryPhoto[] = [];
    for (const categoryPhoto of categoryPhotos) {
      preparedCategoryPhotos.push(this.prepareCategoryPhoto(categoryPhoto));
    }
    return preparedCategoryPhotos;
  }

  private prepareCategoryPhoto(categoryPhoto: CategoryPhoto) {
    const preparedCategoryPhoto = new CategoryPhoto() as any;
    preparedCategoryPhoto.id = categoryPhoto.id;
    preparedCategoryPhoto.categoryId = categoryPhoto.category.id;
    preparedCategoryPhoto.path =
      categoryPhoto.path + '.' + mime.extension(categoryPhoto.mimeType);
    preparedCategoryPhoto.mimeType = categoryPhoto.mimeType;
    return preparedCategoryPhoto;
  }
}
