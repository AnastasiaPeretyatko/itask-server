'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.removeColumn('task', 'to_studentId')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('task', 'to_studentId', {
        type: Sequelize.UUID,
        references: {
          model: 'professors',
          key: 'id',
        },
        allowNull: true,
        defaultValue: null,
    })
  }
};
