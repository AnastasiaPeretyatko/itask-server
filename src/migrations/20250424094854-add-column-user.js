'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn('users', 'fullName', {
        type: Sequelize.STRING,
        defaultValue: null
      }, { transaction });

      await queryInterface.addColumn('users', 'tel', {
        type: Sequelize.STRING,
        defaultValue: null
      }, { transaction });

      await queryInterface.addColumn('users', 'avatar', {
        type: Sequelize.STRING,
        defaultValue: null
      }, { transaction });
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('users', 'fullName', { transaction });
      await queryInterface.removeColumn('users', 'tel', { transaction });
      await queryInterface.removeColumn('users', 'avatar', { transaction });
    })
  }
};
