'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('discussion_thread', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      task_id: {
        type: Sequelize.UUID,
        references: {
          model: 'task',
          key: 'id',
        },
        allowNull: false
      },
      created_by: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      access_role: {
        type: Sequelize.STRING,
      }
    })
  },

  async down (queryInterface) {
    await queryInterface.dropTable('discussion_thread');
  }
};
