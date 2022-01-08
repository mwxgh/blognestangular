import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { BaseService } from '../../../shared/services/base.service';
import { UserRepository } from '../repositories/user.repository';
import { Repository, Connection } from 'typeorm';
import { HashService } from '../../../shared/services/hash/hash.service';
import { IPaginationOptions } from '../../../shared/services/pagination';
import { Role } from '../../auth/entities/role.entity';
import { UserRole } from '../../auth/entities/userRole.entity';
import { map, concat } from 'lodash';

@Injectable()
export class UserService extends BaseService {
  public repository: Repository<any>;
  public entity: any = User;

  constructor(
    private connection: Connection,
    private hashService: HashService
  ) {
    super();
    this.repository = connection.getCustomRepository(UserRepository);
  }

  async isExisting(email: string): Promise<boolean> {
    const is_existing = (await this.repository.count({ where: { email } })) > 0;
    return is_existing;
  }

  async generateVerifyToken(id: number): Promise<boolean> {
    const item = await this.update(id, {
      verify_token: `${this.hashService.md5(
        id.toString()
      )}${this.hashService.md5(new Date().toISOString())}`,
    });
    return item;
  }

  async verify(id: number): Promise<boolean> {
    const item = await this.update(id, {
      verify_token: '',
      verified: true,
      verified_at: new Date(),
    });
    return item;
  }

  // async getImages(user: User | any, options: { from_date?: string; to_date?: string }, pagination_options: IPaginationOptions): Promise<any> {
  //   let query = this.connection
  //     .getCustomRepository(ImageRepository)
  //     .createQueryBuilder('image')
  //     .where('image.imageable_id = :user_id', { user_id: user.id })
  //     .andWhere('image.imageable_type = :type', { type: 'user' });
  //   if (options.from_date !== undefined && options.from_date !== '') {
  //     query = query.andWhere('DATE(image.created_at) >= DATE(:from_date)', { from_date: options.from_date });
  //   }
  //   if (options.to_date !== undefined && options.to_date !== '') {
  //     query = query.andWhere('DATE(image.created_at) <= DATE(:to_date)', { to_date: options.to_date });
  //   }
  //   const pagination = await this.paginate(query, pagination_options);
  //   return pagination;
  // }

  sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  hashPassword(password: string): string {
    return this.hashService.hash(password);
  }

  checkPassword(password: string, hashed: string): boolean {
    return this.hashService.check(password, hashed);
  }

  /**
   * Change password of given user_id
   *
   * @param id  number | string
   * @param password string
   */
  async changePassword(id: number | string, password: string): Promise<User> {
    return this.update(id, { password: this.hashService.hash(password) });
  }

  async attachRole(
    userId: number | string,
    roleId: number | string
  ): Promise<any> {
    const role = await this.connection.getRepository(Role).findOne(roleId);
    const user = await this.connection.getRepository(User).findOne(userId);

    if (role && user) {
      const check = await this.connection
        .getRepository(UserRole)
        .createQueryBuilder('userRole')
        .where('userRole.userId = :userId', { userId: user.id })
        .andWhere('userRole.roleId = :roleId', { roleId: role.id })
        .getOne();
      if (!check) {
        await this.connection
          .getRepository(UserRole)
          .createQueryBuilder()
          .insert()
          .into(UserRole)
          .values({
            userId: user.id,
            roleId: role.id,
          })
          .execute();
      }
    }
    return null;
  }

  // async dettachRole(userId: number | string, roleId: number | string): Promise<any> {
  //   const role = await this.connection.getRepository(Role).findOne(roleId);
  //   const user = await this.connection.getRepository(User).findOne(userId);

  //   if (role && user) {
  //     const check = await this.connection
  //       .getRepository(UserRole)
  //       .createQueryBuilder('user_role')
  //       .where('user_role.user_id = :user_id', { user_id: user.id })
  //       .andWhere('user_role.role_id = :role_id', { role_id: role.id })
  //       .getOne();
  //     if (check) {
  //       await this.connection
  //         .getRepository(UserRole)
  //         .createQueryBuilder('user_role')
  //         .delete()
  //         .where('user_role.user_id = :user_id', { user_id: user.id })
  //         .andWhere('user_role.role_id = :role_id', { role_id: role.id })
  //         .execute();
  //     }
  //   }
  //   return null;
  // }

  // async isLeaders(user: User): Promise<boolean> {
  //   const department = await this.connection
  //     .getRepository(Department)
  //     .createQueryBuilder('department')
  //     .where('department.user_id = :user_id', { user_id: user.id })
  //     .getOne();
  //   if (!department) {
  //     return false;
  //   }
  //   return true;
  // }

  // async getUsersInDepartment(user: User): Promise<any> {
  //   const departments = await this.connection
  //     .getRepository(Department)
  //     .createQueryBuilder('department')
  //     .where('department.user_id = :user_id', { user_id: user.id })
  //     .getMany();
  //   let user_ids = [user.id];
  //   for (const d of departments) {
  //     const users_deparment = await this.connection
  //       .getRepository(UserDepartment)
  //       .createQueryBuilder('user_department')
  //       .where('user_department.department_id = :department_id', { department_id: d.id })
  //       .getMany();
  //     user_ids = concat(
  //       user_ids,
  //       map(users_deparment, i => i.user_id),
  //     );
  //   }
  //   return user_ids;
  // }

  async getAdminUser(): Promise<any> {
    const users = await this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .where('role.slug = :slug', { slug: 'admin' })
      .getMany();
    return users;
  }
}
