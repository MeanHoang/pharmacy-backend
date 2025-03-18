import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerAddress } from '../../entities/customer-address.entity';

@Injectable()
export class CustomerAddressService {
  constructor(
    @InjectRepository(CustomerAddress)
    private readonly customerAddressRepository: Repository<CustomerAddress>,
  ) {}

  async findAll(customer_id: number): Promise<CustomerAddress[]> {
    try {
      return await this.customerAddressRepository.find({
        where: { customer: { id: customer_id } },
      });
    } catch (error) {
      throw new Error('Lỗi truy vấn danh sách địa chỉ');
    }
  }

  async create(address: CustomerAddress): Promise<CustomerAddress> {
    try {
      console.log('>>>check new address: ', address);

      return await this.customerAddressRepository.save(address);
    } catch (error) {
      console.error('>>> check err: ', error);
      throw new Error('Lỗi khi thêm địa chỉ');
    }
  }

  async update(
    id: number,
    address: Partial<CustomerAddress>,
  ): Promise<CustomerAddress | null> {
    try {
      const existingAddress = await this.customerAddressRepository.findOne({
        where: { id },
      });
      if (!existingAddress) return null;

      Object.assign(existingAddress, address);
      return await this.customerAddressRepository.save(existingAddress);
    } catch (error) {
      throw new Error('Lỗi khi cập nhật địa chỉ');
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const address = await this.customerAddressRepository.findOne({
        where: { id },
      });
      if (!address) {
        throw new Error('Địa chỉ không tồn tại');
      }

      const result = await this.customerAddressRepository.delete(id);
      return (result.affected ?? 0) > 0; // Kiểm tra nếu 'affected' là null hoặc undefined thì mặc định là 0
    } catch (error) {
      throw new Error('Lỗi khi xóa địa chỉ: ' + error.message);
    }
  }
}
