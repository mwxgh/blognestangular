import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreatePermissionTable1641521972102 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'permission',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'slug',
            type: 'varchar',
          },
          {
            name: 'permissionGroupId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'deletedAt',
            isNullable: true,
            type: 'datetime',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'NOW()',
          },
        ],
      }),
      true
    );
    await queryRunner.createIndex(
      'permission',
      new TableIndex({
        name: 'IDX_PERMISSION_SLUG',
        columnNames: ['slug'],
      })
    );
    // await queryRunner.createForeignKey(
    //   'permission',
    //   new TableForeignKey({
    //     columnNames: ['permissionGroupId'],
    //     referencedColumnNames: ['id'],
    //     referencedTableName: 'permissionGroup',
    //     onDelete: 'CASCADE',
    //   })
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('permission');
  }
}
