'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.dropTable('tasks')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.createTable('tasks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      startDate: {
        field: 'start_date',
        type: Sequelize.DATE,
      },
      endDate: {
        field: 'end_date',
        type: Sequelize.DATE,
      },
      creatorId: {
        field: 'creator_id',
        type: Sequelize.UUID,
        references: {
          model: 'professors',
          key: 'id',
        },
      },
      semesterGroupCourseId: {
        field: 'semester_group_course_id',
        type: Sequelize.UUID,
        references: {
          model: 'semester_group_course',
          key: 'id',
        },
      },
      fromStudentId: {
        field: 'from_student_id',
        type: Sequelize.UUID,
        references: {
          model: 'students',
          key: 'id',
        },
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
  }
};
