'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('task', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      text: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: null,
      },
      creatorId: {
        type: Sequelize.UUID,
        references: {
          model: 'professors',
          key: 'id',
        }
      },
      values: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      assignmentId: {
        type: Sequelize.UUID,
        references: {
          model: 'assignment',
          key: 'id',
        }
      },
      to_studentId: {
        type: Sequelize.UUID,
        references: {
          model: 'professors',
          key: 'id',
        },
        allowNull: true,
        defaultValue: null,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    })

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('task');
  }
};
