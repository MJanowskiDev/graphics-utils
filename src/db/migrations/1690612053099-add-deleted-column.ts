import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDeletedColumn1690612053099 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'deleted',
        type: 'boolean',
        default: false,
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('user');
    const columnExists = table?.findColumnByName('deleted');

    if (columnExists) {
      await queryRunner.dropColumn('user', 'deleted');
    }
  }
}
