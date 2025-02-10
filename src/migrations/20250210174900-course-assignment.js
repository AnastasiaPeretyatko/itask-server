'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('course_assignment', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      courseId: {
        field: 'course_id',
        type: Sequelize.UUID,
        references: {
          model: 'courses',
          key: 'id',
        },
        allowNull: false,
      },
      professorId: {
        field: 'professor_id',
        type: Sequelize.UUID,
        references: {
          model: 'professors',
          key: 'id',
        },
      },
      semesterId: {
        field: 'semester_id',
        type: Sequelize.UUID,
        references: {
          model: 'semesters',
          key: 'id',
        },
        allowNull: true
      },
      groupId: {
        field: 'group_id',
        type: Sequelize.UUID,
        references: {
          model: 'groups',
          key: 'id',
        },
        allowNull: true
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


  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('course_assignments');
  }
};
