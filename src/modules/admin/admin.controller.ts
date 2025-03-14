import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin } from '../../entities/admin.entity';
import { ResponseDto } from '../../dtos/response.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async findAll(): Promise<ResponseDto<Admin[]>> {
    const admins = await this.adminService.findAll();
    return new ResponseDto<Admin[]>(
      'success',
       'Admin list retrieved successfully',
        admins);
  }
}
