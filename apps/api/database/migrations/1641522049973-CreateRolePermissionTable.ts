import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateRolePermissionTable1641522049973
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'rolePermission',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'roleId',
            type: 'int',
          },
          {
            name: 'permissionId',
            type: 'int',
          },
        ],
      }),
      true
    );

    await queryRunner.createIndex(
      'rolePermission',
      new TableIndex({
        name: 'IDX_ROLE_PERMISSION_ROLE_ID',
        columnNames: ['roleId'],
      })
    );

    await queryRunner.createIndex(
      'rolePermission',
      new TableIndex({
        name: 'IDX_ROLE_PERMISSION_PER_ID',
        columnNames: ['permissionId'],
      })
    );

    // await queryRunner.createForeignKey(
    //   'rolePermission',
    //   new TableForeignKey({
    //     columnNames: ['roleId'],
    //     referencedColumnNames: ['id'],
    //     referencedTableName: 'role',
    //     onDelete: 'CASCADE',
    //   })
    // );

    // await queryRunner.createForeignKey(
    //   'rolePermission',
    //   new TableForeignKey({
    //     columnNames: ['permissionId'],
    //     referencedColumnNames: ['id'],
    //     referencedTableName: 'permission',
    //     onDelete: 'CASCADE',
    //   })
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('rolePermission');
  }
}
