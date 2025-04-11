'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('task', 'values');
    await queryInterface.addColumn('task', 'score', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    })
    await queryInterface.addColumn('task', 'priority', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    })
    await queryInterface.addColumn('task', 'startDate', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    })
    await queryInterface.addColumn('task', 'endDate', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    })
    await queryInterface.addColumn('task', 'tags', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: null,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('task', 'score');
    await queryInterface.removeColumn('task', 'priority');
    await queryInterface.removeColumn('task', 'startDate');
    await queryInterface.removeColumn('task', 'endDate');
    await queryInterface.removeColumn('task', 'tags');
    await queryInterface.addColumn('task', 'values', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: null,
    })
  }
};
