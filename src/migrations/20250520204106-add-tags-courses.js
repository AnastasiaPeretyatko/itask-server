'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('courses', 'tags', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: null
    })

  },

  async down (queryInterface) {
    await queryInterface.removeColumn('courses', 'tags')
  }
};
