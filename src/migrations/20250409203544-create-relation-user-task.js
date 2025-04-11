'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_task', {
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
        allowNull: false,
      },
      student_id: {
        type: Sequelize.UUID,
        references: {
          model: 'students',
          key: 'id',
        },
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending',
      },
      grade: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      o: {
        type: Sequelize.DECIMAL(40, 30),
        allowNull: false,
        defaultValue: 0,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      answer: {
        type: Sequelize.JSONB,
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
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_task');
  }
};
