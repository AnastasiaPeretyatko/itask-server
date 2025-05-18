'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('document_task', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      documentId: {
        type: Sequelize.UUID,
        references: {
          model: 'documents',
          key: 'id',
        },
        allowNull: false
      },
      userTaskId: {
        type: Sequelize.UUID,
        references: {
          model: 'user_task',
          key: 'id',
        },
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  async down (queryInterface) {
    await queryInterface.dropTable('document_task');
  }
};
