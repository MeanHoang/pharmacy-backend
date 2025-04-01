import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, Not } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Admin } from '../../entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  // Find all admins with pagination and search
  async findAll(page: number, limit: number, search?: string) {
    try {
      const whereCondition = search ? { username: Like(`%${search}%`) } : {};

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
    } catch (error) {
      throw new InternalServerErrorException('Lỗi khi tải danh sách admin');
    }
  }

  // Create a new admin
  async create(admin: Admin) {
    try {
      // Check for duplicate username
      const checkAdmin = await this.adminRepository.findOneBy({
        username: admin.username,
      });

      if (checkAdmin) {
        return null;
      }

      const hashedPassword = await bcrypt.hash(admin.password, 10);

      const finalAdmin = this.adminRepository.create({
        ...admin,
        password: hashedPassword,
      });

      await this.adminRepository.save(finalAdmin);

      return finalAdmin;
    } catch (error) {
      throw new InternalServerErrorException('Lỗi khi tạo tài khoản admin');
    }
  }

  // Update an admin
  async update(id: number, adminData: Partial<Admin>) {
    try {
      const admin = await this.adminRepository.findOneBy({ id });

      if (!admin) {
        return null;
      }

      // Check if the new username is already taken
      if (adminData.username) {
        const existingAdmin = await this.adminRepository.findOne({
          where: { username: adminData.username, id: Not(id) },
        });

        if (existingAdmin) {
          return 'duplicate';
        }
      }

      // Handle password update only if it's a new unhashed password
      if (adminData.password && adminData.password !== admin.password) {
        const isSamePassword = await bcrypt.compare(
          adminData.password,
          admin.password,
        );
        if (!isSamePassword) {
          adminData.password = await bcrypt.hash(adminData.password, 10);
        } else {
          delete adminData.password;
        }
      }

      // Merge new data
      Object.assign(admin, adminData);

      return await this.adminRepository.save(admin);
    } catch (error) {
      throw new InternalServerErrorException(
        'Lỗi khi cập nhật thông tin admin',
      );
    }
  }

  // Delete an admin
  async delete(id: number) {
    try {
      const deleteResult = await this.adminRepository.delete(id);

      if (deleteResult.affected === 0) {
        return false;
      }

      return true;
    } catch (error) {
      throw new InternalServerErrorException('Lỗi khi xóa admin');
    }
  }

  // Get an admin by ID
  async getAdminByID(id: number) {
    try {
      const admin = await this.adminRepository.findOneBy({ id });

      if (!admin) {
        return null;
      }

      return admin;
    } catch (error) {
      throw new InternalServerErrorException('Lỗi khi lấy thông tin admin');
    }
  }

  // Reset admin password
  async resetPassword(id: number): Promise<Admin | null> {
    try {
      const admin = await this.adminRepository.findOneBy({ id });

      if (!admin) {
        return null;
      }

      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || '123';
      const newPassword = await bcrypt.hash(defaultPassword, 10);

      admin.password = newPassword;
      await this.adminRepository.save(admin);

      return admin;
    } catch (error) {
      throw new InternalServerErrorException('Lỗi khi đặt lại mật khẩu admin');
    }
  }

  async updateStatus(id: number): Promise<Admin | null> {
    const admin = await this.adminRepository.findOne({ where: { id } });

    if (!admin) return null;

    admin.is_active = !admin.is_active;
    return await this.adminRepository.save(admin);
  }
}
