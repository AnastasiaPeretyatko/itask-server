'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('documents', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      creatorId: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: false
      },
      parentId: {
        type: Sequelize.UUID,
        references: {
          model: 'documents',
          key: 'id',
        },
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Без названия'
      },
      context: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      path: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }
    })
  },

  async down (queryInterface) {
    await queryInterface.dropTable('documents');
  }
};
