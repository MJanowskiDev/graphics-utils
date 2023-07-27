import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1690481063987 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user', true);
    await queryRunner.query(
      `CREATE TABLE "user" 
      ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
      "email" character varying NOT NULL, 
      "hashedPassword" character varying NOT NULL, 
      "role" character varying, 
      "activated" boolean NOT NULL DEFAULT false, 
      "tokenId" uuid,
      "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
       CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('user', 'IDX_e12875dfb3b1d92d7d7c5377e2');
    await queryRunner.dropTable('user');
  }
}
