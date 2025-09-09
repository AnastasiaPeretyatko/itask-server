'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('user_task', 'comment', {
      type: Sequelize.STRING,
      defaultValue: null
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('user_task', 'comment');
  }
};
