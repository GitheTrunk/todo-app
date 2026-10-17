import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProfile1792215000000 implements MigrationInterface {
  name = 'CreateProfile1792215000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "profile" ("id" SERIAL NOT NULL, "username" character varying(100) NOT NULL, "displayName" character varying(150) NOT NULL, "email" character varying(255) NOT NULL DEFAULT \'\', CONSTRAINT "PK_profile_id" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      `INSERT INTO "profile" ("username", "displayName", "email") VALUES ('alexmorgan', 'Alex Morgan', '')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "profile"');
  }
}
