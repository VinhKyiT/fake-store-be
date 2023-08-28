import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';

import {
  CreateUserDto,
  FilterUsersDto,
  ValidateUserDto,
  UpdateUserDto,
} from '@dtos/user.dto';
import { User } from '@db/entities/user.entity';
import { Role } from '@models/roles';
import md5 from 'md5';
const USERS = [1, 2, 3];

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  findByEmail(email: User['email']) {
    return this.usersRepo.findOneBy({ email });
  }

  findById(id: User['id']) {
    return this.usersRepo.findOneByOrFail({ id });
  }

  getAll(params: FilterUsersDto) {
    const options: FindManyOptions<User> = {};
    const { limit, offset } = params;
    if (limit > 0 && offset >= 0) {
      options.take = limit;
      options.skip = offset;
    }
    return this.usersRepo.find(options);
  }

  async isAvailable(dto: ValidateUserDto) {
    let isAvailable = false;
    if (dto.email) {
      isAvailable = (await this.findByEmail(dto.email)) === undefined;
    }
    return { isAvailable };
  }

  create(dto: CreateUserDto) {
    const newUser = this.usersRepo.create(dto);
    newUser.role = dto.role ?? Role.customer;
    newUser.password = md5(md5(dto.password));
    return this.usersRepo.save(newUser);
  }

  async update(id: User['id'], changes: UpdateUserDto) {
    if (USERS.some((userId) => userId === id)) {
      throw new UnauthorizedException(
        'This user is not available for updating; instead, create your own user to update.',
      );
    }
    const user = await this.findById(id);
    this.usersRepo.merge(user, changes);
    return this.usersRepo.save(user);
  }

  async delete(id: number) {
    if (USERS.some((userId) => userId === id)) {
      throw new UnauthorizedException(
        'This user is not available for deleting; instead, create your own user to delete.',
      );
    }
    const user = await this.findById(id);
    await this.usersRepo.delete({ id: user.id });
    return true;
  }
}
