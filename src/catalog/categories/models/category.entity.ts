/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/models/product.entity';
import { CategoryGroup } from './category-group.entity';
import { CategoryPhoto } from '../categories-photos/models/categories-photos.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  slug?: string;

  @ManyToOne(() => Category, (category) => category.childCategories, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  parentCategory?: Category;

  @OneToMany(() => Category, (category) => category.parentCategory, {
    onDelete: 'SET NULL',
  })
  childCategories: Category[];


  @OneToMany(() => CategoryPhoto, (photo) => photo.category, {
    eager: true,
    onDelete: 'CASCADE',
    cascade: true,
  })
  photos: CategoryPhoto[];

  
  @Column({ default: '' })
  photosOrder: string;

 
  @ManyToMany(
    () => CategoryGroup,
    (categoryGroup) => categoryGroup.categories,
    { eager: true, onDelete: 'CASCADE' },
  )
  @JoinTable()
  groups: CategoryGroup[];

  @ManyToMany(() => Product, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  products: Product[];
}
