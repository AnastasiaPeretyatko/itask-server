'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('message', 'room_id', {
      type: Sequelize.UUID,
        references: {
          model: 'room',
          key: 'id',
        },
      allowNull: false
    })
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('message', 'room_id');
  }
};
