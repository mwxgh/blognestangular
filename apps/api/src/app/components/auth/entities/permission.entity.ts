import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn, OneToOne, ManyToMany, JoinTable } from 'typeorm';
import { PermissionGroup } from './permissionGroup.entity';
import { Role } from './role.entity';

@Entity({ name: 'permission' })
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'varchar',
  })
  slug: string;

  @Column()
  permissionGroupId: number;

  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    precision: null,
    default: () => 'NOW()',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: null,
    default: () => 'NOW()',
  })
  public updatedAt: Date;

  @OneToOne(
    () => PermissionGroup,
    permissionGroup => permissionGroup.permissions,
  )
  @JoinColumn({ name: 'permissionGroupId', referencedColumnName: 'id' })
  permissionGroup: PermissionGroup[];

  @ManyToMany(
    () => Role,
    role => role.permissions,
    { cascade: ['insert'] },
  )
  @JoinTable({
    name: 'rolePermission',
    joinColumn: {
      name: 'permissionId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];
}
