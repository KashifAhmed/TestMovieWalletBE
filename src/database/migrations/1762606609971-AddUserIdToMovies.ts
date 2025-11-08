import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdToMovies1762606609971 implements MigrationInterface {
    name = 'AddUserIdToMovies1762606609971'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add the column as nullable first
        await queryRunner.query(`ALTER TABLE "movies" ADD "user_id" uuid`);

        // Set a default UUID for existing rows (you may want to use a specific user ID)
        // This sets all existing movies to a default user ID
        await queryRunner.query(`UPDATE "movies" SET "user_id" = '00000000-0000-0000-0000-000000000000' WHERE "user_id" IS NULL`);

        // Now make it NOT NULL
        await queryRunner.query(`ALTER TABLE "movies" ALTER COLUMN "user_id" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "user_id"`);
    }

}
