'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('message', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      thread_id: {
        type: Sequelize.UUID,
        references: {
          model: 'discussion_thread',
          key: 'id',
        },
      },
      author_id: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      content: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      is_edited: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_important: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      parent_id: {
        type: Sequelize.UUID,
        references: {
          model: 'message',
          key: 'id',
        },
      }
    })
  },

  async down (queryInterface) {
    await queryInterface.dropTable('message');
  }
};
