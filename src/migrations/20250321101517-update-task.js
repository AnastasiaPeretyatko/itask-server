'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.removeColumn('tasks', 'semester_group_course_id');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('tasks', 'semester_group_course_id', {
      field: 'semester_group_course_id',
        type: Sequelize.UUID,
        references: {
          model: 'semester_group_course',
          key: 'id',
        },
    })
  }
};
