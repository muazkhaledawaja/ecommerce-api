import { Injectable } from '@nestjs/common';
import { CategoryPhotosService } from './categories-photos.service';
import { CategoryPhoto } from './models/categories-photos.entity';
import { Importer } from '../../../import-export/models/importer.interface';
import { Collection } from '../../../import-export/models/collection.type';
import { IdMap } from '../../../import-export/models/id-map.type';
import { ParseError } from '../../../errors/parse.error';
import { Category } from '../models/category.entity';

@Injectable()
export class CategoryPhotosImporter implements Importer {
  constructor(private categoryPhotosService: CategoryPhotosService) {}

  async import(
    categoryPhotos: Collection,
    idMaps: Record<string, IdMap>,
  ): Promise<IdMap> {
    const parsedCategoryPhotos = this.parseCategoryPhotos(
      categoryPhotos,
      idMaps.categorys,
    );
    const idMap: IdMap = {};
    for (const categoryPhoto of parsedCategoryPhotos) {
      const { id: newId } = await this.categoryPhotosService.createCategoryPhoto(
        categoryPhoto.category.id,
        categoryPhoto.path,
        categoryPhoto.mimeType,
      );
      idMap[categoryPhoto.id] = newId;
    }
    return idMap;
  }

  async clear() {
    const categoryPhotos = await this.categoryPhotosService.getCategoryPhotos();
    let deleted = 0;
    for (const categoryPhoto of categoryPhotos) {
      await this.categoryPhotosService.deleteCategoryPhoto(
        categoryPhoto.category.id,
        categoryPhoto.id,
      );
      deleted += 1;
    }
    return deleted;
  }

  private parseCategoryPhotos(categoryPhotos: Collection, categorysIdMap: IdMap) {
    const parsedCategoryPhotos: CategoryPhoto[] = [];
    for (const categoryPhoto of categoryPhotos) {
      parsedCategoryPhotos.push(
        this.parseCategoryPhoto(categoryPhoto, categorysIdMap),
      );
    }
    return parsedCategoryPhotos;
  }

  private parseCategoryPhoto(
    categoryPhoto: Collection[number],
    categorysIdMap: IdMap,
  ) {
    const parsedCategoryPhoto = new CategoryPhoto();
    try {
      parsedCategoryPhoto.id = categoryPhoto.id as number;
      parsedCategoryPhoto.category = {
        id: categorysIdMap[categoryPhoto.categoryId as number],
      } as Category;
      parsedCategoryPhoto.path = categoryPhoto.path as string;
      parsedCategoryPhoto.mimeType = categoryPhoto.mimeType as string;
    } catch (e) {
      throw new ParseError('category-photo');
    }
    return parsedCategoryPhoto;
  }
}
