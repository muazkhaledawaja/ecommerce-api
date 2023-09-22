/* eslint-disable prettier/prettier */
import {
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    MaxFileSizeValidator,
    Param,
    ParseBoolPipe,
    ParseFilePipe,
    ParseIntPipe,
    Post,
    Query,
    StreamableFile,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import {
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiProduces,
    ApiTags,
    ApiUnauthorizedResponse,
  } from '@nestjs/swagger';
  import { Roles } from '../../../auth/decorators/roles.decorator';
  import { Role } from '../../../users/models/role.enum';
  import { Category } from '../models/category.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { CategoryPhotosService } from './categories-photos.service';
  import { fileBodySchema } from '../../../local-files/models/file-body.schema';
  import { fileResponseSchema } from '../../../local-files/models/file-response.schema';
  
  @ApiTags('categories')
  @Controller('categories/:id')
  export class CategoryPhotosController {
    constructor(private categoryPhotosService: CategoryPhotosService) {}
  
    @Get('photos/:photoId')
    @ApiOkResponse({
      schema: fileResponseSchema,
      description: 'Category photo with given id',
    })
    @ApiProduces('image/*')
    @ApiNotFoundResponse({ description: 'Category photo not found' })
    async getCategoryPhoto(
      @Param('id', ParseIntPipe) id: number,
      @Param('photoId', ParseIntPipe) photoId: number,
      @Query('thumbnail', ParseBoolPipe) thumbnail: boolean,
    ): Promise<StreamableFile> {
      return await this.categoryPhotosService.getCategoryPhoto(
        id,
        photoId,
        thumbnail,
      );
    }
  
    @Post('photos')
    @Roles(Role.Admin, Role.Manager)
    @ApiUnauthorizedResponse({ description: 'User not logged in' })
    @ApiForbiddenResponse({ description: 'User not authorized' })
    @ApiNotFoundResponse({ description: 'Category not found' })
    @ApiCreatedResponse({ type: Category, description: 'Category photo added' })
    @ApiBody({ schema: fileBodySchema })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    async addCategoryPhoto(
      @Param('id', ParseIntPipe) id: number,
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
            new FileTypeValidator({ fileType: /^image\/(png|jpe?g|gif|webp)/ }),
          ],
        }),
      )
      file: Express.Multer.File,
    ): Promise<Category> {
      return await this.categoryPhotosService.addCategoryPhoto(id, file);
    }
  
    @Delete('photos/:photoId')
    @Roles(Role.Admin, Role.Manager)
    @ApiUnauthorizedResponse({ description: 'User not logged in' })
    @ApiForbiddenResponse({ description: 'User not authorized' })
    @ApiNotFoundResponse({ description: 'Category not found' })
    @ApiOkResponse({ type: Category, description: 'Category photo deleted' })
    async deleteCategoryPhoto(
      @Param('id', ParseIntPipe) id: number,
      @Param('photoId', ParseIntPipe) photoId: number,
    ): Promise<Category> {
      return await this.categoryPhotosService.deleteCategoryPhoto(id, photoId);
    }
  }
  