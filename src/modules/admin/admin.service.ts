import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, Not  } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

import { Admin } from '../../entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  //find all
  async findAll(page: number, limit: number, search?: string) {
    const whereCondition = search
      ? { username: Like(`%${search}%`) } 
      : {}; 

    const [data, total] = await this.adminRepository.findAndCount({
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
  async create(admin: Admin){
    //check username 
    const checkAdmin = await this.adminRepository.findOneBy({ username: admin.username});

    if(checkAdmin){
      return null;
    }

    const hashedPassword = await bcrypt.hash(admin.password, 10);

    const finalAdmin = this.adminRepository.create({
      ...admin,
      password: hashedPassword,
    });
    
    await this.adminRepository.save(finalAdmin);

      return {
        id: finalAdmin.id,
        username: finalAdmin.username,
        fullname: finalAdmin.fullname,
        is_active: finalAdmin.is_active,
        created_at: finalAdmin.created_at,
        updated_at: finalAdmin.updated_at,
  };
  }

  //update
  async update(id: number, adminData: Partial<Admin>){
    const admin = await this.adminRepository.findOneBy({ id });

    if (!admin) {
      return null;
    }

    // Kiểm tra username có bị trùng với admin khác không
    if (adminData.username) {
      const existingAdmin = await this.adminRepository.findOne({
        where: { username: adminData.username, id: Not(id) },
      });

      if (existingAdmin) {
        return 'duplicate'; 
      }
    }

    if (adminData.password) {
      const isSamePassword = await bcrypt.compare(adminData.password, admin.password);
      if (!isSamePassword) {
        adminData.password = await bcrypt.hash(adminData.password, 10);
      } else {
        delete adminData.password; 
      }
    }

    // Cập nhật từng trường nếu được gửi lên
    Object.assign(admin, adminData);

    return await this.adminRepository.save(admin);
  }

  //delete 
  async delete(id: number) {
    const deleteResult = await this.adminRepository.delete(id);
    
    if (deleteResult.affected === 0) {
      return false;
    }
  
    return true;
  }
  
  async getAdminByID(id: number) {
    const admin = await this.adminRepository.findOneBy({ id });
    
    if (!admin) {
      return null;
    }
  
    return admin;
  }

  async resetPassword(id: number): Promise<Admin | null> {
    const admin = await this.adminRepository.findOneBy({ id });

    if (!admin) {
      return null;
    }

    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || '123';

    const newPassword = await bcrypt.hash(defaultPassword, 10);
    admin.password = newPassword;
    await this.adminRepository.save(admin);

    return admin;
  }

}
