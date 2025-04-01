import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, Not } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Store } from '../../entities/store.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  //find all
  async findAll(page: number, limit: number, search?: string) {
    const whereCondition = search ? { username: Like(`%${search}%`) } : {};

    const [data, total] = await this.storeRepository.findAndCount({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit,
    };
  }

  //create
  async create(store: Store) {
    //check username
    const checkStore = await this.storeRepository.findOneBy({
      username: store.username,
    });

    if (checkStore) {
      return null;
    }

    const hashedPassword = await bcrypt.hash(store.password, 10);

    const finalStore = this.storeRepository.create({
      ...store,
      password: hashedPassword,
    });

    await this.storeRepository.save(finalStore);

    return finalStore;
  }

  //update
  async update(id: number, storeData: Partial<Store>) {
    const store = await this.storeRepository.findOneBy({ id });

    if (!store) {
      return null;
    }

    // Kiểm tra username có bị trùng với store khác không
    if (storeData.username) {
      const existingStore = await this.storeRepository.findOne({
        where: { username: storeData.username, id: Not(id) },
      });

      if (existingStore) {
        return 'duplicate';
      }
    }

    if (storeData.password) {
      const isSamePassword = await bcrypt.compare(
        storeData.password,
        store.password,
      );
      if (!isSamePassword) {
        storeData.password = await bcrypt.hash(storeData.password, 10);
      } else {
        delete storeData.password;
      }
    }

    // Cập nhật từng trường nếu được gửi lên
    Object.assign(store, storeData);

    return await this.storeRepository.save(store);
  }

  //delete
  async delete(id: number) {
    const deleteResult = await this.storeRepository.delete(id);

    if (deleteResult.affected === 0) {
      return false;
    }

    return true;
  }

  //1 detail
  async getStoreByID(id: number) {
    const store = await this.storeRepository.findOneBy({ id });

    if (!store) {
      return null;
    }

    return store;
  }

  //reset pasword
  async resetPassword(id: number): Promise<Store | null> {
    const store = await this.storeRepository.findOneBy({ id });

    if (!store) {
      return null;
    }

    const defaultPassword = process.env.DEFAULT_STORE_PASSWORD || '1';

    const newPassword = await bcrypt.hash(defaultPassword, 10);
    store.password = newPassword;
    await this.storeRepository.save(store);

    return store;
  }

  async updateStatus(id: number): Promise<Store | null> {
    const store = await this.storeRepository.findOne({ where: { id } });

    if (!store) return null;

    store.is_active = !store.is_active; // Đảo ngược trạng thái
    return await this.storeRepository.save(store);
  }
}
