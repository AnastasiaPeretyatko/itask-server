'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn('room', 'task_id', {
        type: Sequelize.UUID,
        references: {
          model: 'task',
          key: 'id',
        },
        defaultValue: null
      }, { transaction });
      await queryInterface.addColumn('room', 'access', {
        type: Sequelize.ENUM('students', 'professors', 'all'),
        defaultValue: null
      }, { transaction });
  })
    
  },

  async down (queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('room', 'task_id', { transaction });
      await queryInterface.removeColumn('room', 'access', { transaction });
    })
  }
};
