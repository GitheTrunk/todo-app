import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTodoBonuses1792220000000 implements MigrationInterface {
  name = 'AddTodoBonuses1792220000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "todo" ADD "starred" boolean NOT NULL DEFAULT false',
    );
    await queryRunner.query(
      'ALTER TABLE "todo" ADD "position" integer NOT NULL DEFAULT 0',
    );
    await queryRunner.query('UPDATE "todo" SET "position" = "id"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "todo" DROP COLUMN "position"');
    await queryRunner.query('ALTER TABLE "todo" DROP COLUMN "starred"');
  }
}
