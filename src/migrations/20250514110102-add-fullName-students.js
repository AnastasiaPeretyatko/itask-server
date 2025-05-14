'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.sequelize.query(`
      UPDATE "users"
      SET "fullName" = (
        SELECT "fullName" FROM "students" WHERE "students"."user_id" = "users"."id"
      )
      WHERE EXISTS (
        SELECT 1 FROM "students" WHERE "students"."user_id" = "users"."id"
      );
    `);
  },

  async down (queryInterface, Sequelize) {
    // Для отмены миграции можно просто очистить столбец `fullName` (если нужно)
    await queryInterface.bulkUpdate('users', { fullName: null }, {});
  }
};
