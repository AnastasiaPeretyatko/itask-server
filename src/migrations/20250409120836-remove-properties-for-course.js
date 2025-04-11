'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.removeColumn('courses', 'properties')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('courses', 'properties', {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: [],
    })
  }
};
