'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('courses', 'properties', {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: [],
    })
    await queryInterface.addColumn('courses', 'learning_form', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    })
    await queryInterface.addColumn('courses', 'language', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    })
    await queryInterface.addColumn('courses', 'assessment_system', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    })
    await queryInterface.addColumn('courses', 'access', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('courses', 'properties')
    await queryInterface.removeColumn('courses', 'learning_form')
    await queryInterface.removeColumn('courses', 'language')
    await queryInterface.removeColumn('courses', 'assessment_system')
    await queryInterface.removeColumn('courses', 'access')
  }
};
