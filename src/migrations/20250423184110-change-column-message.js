'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('message', 'created_at', 'createdAt')
    await queryInterface.renameColumn('message', 'updated_at', 'updatedAt')
    await queryInterface.addColumn('message', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true
    })
  },

  async down (queryInterface) {
    await queryInterface.renameColumn('message', 'createdAt', 'created_at')
    await queryInterface.renameColumn('message', 'updatedAt', 'updated_at') 
    await queryInterface.removeColumn('message', 'deletedAt')
  }
};
