'use strict';

const { v4: UUIDV4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('groups', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      universityId: {
        field: 'university_id',
        type: Sequelize.UUID,
        references: {
          model: 'university',
          key: 'id',
        },
        allowNull: false,
      },
      degree: {
        type: Sequelize.ENUM('bachelor', 'specialist', 'master'),
        allowNull: false,
      },
      educationMode: {
        field: 'education_mode',
        type: Sequelize.ENUM('full-time', 'extramural'),
        allowNull: false,
      },
      course: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      groupNumber:{
        field: 'group_number',
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('groups');
  },
};
