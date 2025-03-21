'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.renameTable('course_assignment', 'assignment');
    await queryInterface.renameColumn('assignment', 'course_id', 'courseId');
    await queryInterface.renameColumn('assignment', 'professor_id', 'professorId');
    await queryInterface.renameColumn('assignment', 'group_id', 'groupId');
    await queryInterface.renameColumn('assignment', 'semester_id', 'semesterId');
  },

  async down (queryInterface) {
    await queryInterface.renameTable('assignment', 'course_assignment');
    await queryInterface.renameColumn('course_assignment', 'courseId', 'course_id');
    await queryInterface.renameColumn('course_assignment', 'professorId', 'professor_id');
    await queryInterface.renameColumn('course_assignment', 'groupId', 'group_id');
    await queryInterface.renameColumn('course_assignment', 'semesterId', 'semester_id');
  }
};
