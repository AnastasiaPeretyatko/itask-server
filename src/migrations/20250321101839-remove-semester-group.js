'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.dropTable('semester_groups');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.createTable('semester_groups', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      groupId: {
        field: 'group_id',
        type: Sequelize.UUID,
        references: {
          model: 'groups',
          key: 'id',
        },
        allowNull: false,
      },
      semesterId: {
        field: 'semester_id',
        type: Sequelize.UUID,
        references: {
          model: 'semesters',
          key: 'id',
        },
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  }
};
