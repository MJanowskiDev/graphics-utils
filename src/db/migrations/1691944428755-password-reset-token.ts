import { MigrationInterface, QueryRunner } from 'typeorm';

export class PasswordResetToken1691944428755 implements MigrationInterface {
  tableName = 'user';
  columnName = 'passwordResetToken';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "${this.tableName}" ADD COLUMN "${this.columnName}" text NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.tableName);
    const columnExists = table?.findColumnByName(this.columnName);

    if (columnExists) {
      await queryRunner.query(`
          ALTER TABLE "${this.tableName}" DROP COLUMN "${this.columnName}";
      `);
    }
  }
}
