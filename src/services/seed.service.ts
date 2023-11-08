import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';

import { Category } from '@db/entities/category.entity';
import { Product } from '@db/entities/product.entity';
import { User } from '@db/entities/user.entity';
import { Role } from '@models/roles';
import { generateImage } from '@utils/generate-img';

@Injectable()
export class SeedService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async init() {
    await this.dataSource.synchronize(true);

    // -------- REPOS --------

    const usersRepo = this.dataSource.getRepository(User);
    const categoriesRepo = this.dataSource.getRepository(Category);
    const productsRepo = this.dataSource.getRepository(Product);

    // -------- USERS --------

    await usersRepo.save([
      {
        id: 1,
        email: 'kybuidev@gmail.com',
        password: '123123',
        name: 'Ky Bui',
        role: Role.admin,
        avatar: generateImage('face'),
      },
      {
        id: 2,
        email: 'maria@mail.com',
        password: '123123',
        name: 'Maria',
        role: Role.customer,
        avatar: generateImage('face'),
      },
      {
        id: 3,
        email: 'admin@mail.com',
        password: '123123',
        name: 'Admin',
        role: Role.admin,
        avatar: generateImage('face'),
      },
    ]);

    // -------- CATEGORIES --------

    const categoriesRta = await categoriesRepo.save([
      {
        id: 1,
        name: 'Clothes',
        keyLoremSpace: 'fashion',
        image: generateImage('fashion'),
      },
      {
        id: 2,
        name: 'Electronics',
        keyLoremSpace: 'watch',
        image: generateImage('watch'),
      },
      {
        id: 3,
        name: 'Furniture',
        keyLoremSpace: 'furniture',
        image: generateImage('furniture'),
      },
      {
        id: 4,
        name: 'Shoes',
        keyLoremSpace: 'shoes',
        image: generateImage('shoes'),
      },
      {
        id: 5,
        name: 'Others',
        keyLoremSpace: 'random',
        image: generateImage('random'),
      },
    ]);

    // -------- Products --------

    const productsData: Array<Partial<Product>> = [];
    const size = 200;
    for (let index = 0; index < size; index++) {
      const category = faker.helpers.arrayElement(categoriesRta);
      const images = [
        generateImage(category.keyLoremSpace),
        generateImage(category.keyLoremSpace),
        generateImage(category.keyLoremSpace),
      ];
      productsData.push({
        title: faker.commerce.productName(),
        price: parseInt(faker.commerce.price(), 10),
        description: faker.commerce.productDescription(),
        category,
        images: JSON.stringify(images),
      });
    }
    await productsRepo.save(productsData);

    // -------- COUNTERS --------

    const users = await usersRepo.find();
    const categories = await categoriesRepo.find();
    const products = await productsRepo.find();

    return {
      users: users.length,
      categories: categories.length,
      products: products.length,
    };
  }
}
