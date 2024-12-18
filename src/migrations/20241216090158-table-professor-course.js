'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('professor_course', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      professorId: {
        field: 'professor_id',
        type: Sequelize.UUID,
        references: {
          model: 'professors',
          key: 'id',
        },
        allowNull: false,
      },
      semesterGroupCourseId: {
        field: 'semester_group_course_id',
        type: Sequelize.UUID,
        references: {
          model: 'semester_group_course',
          key: 'id',
        },
        allowNull: false,
      },
      position: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('professor_course');
  },
};
