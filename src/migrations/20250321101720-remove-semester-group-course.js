'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.dropTable('semester_group_course');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.createTable('semester_group_course', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      semesterGroupId: {
        field: 'semester_group_id',
        type: Sequelize.UUID,
        references: {
          model: 'semester_groups',
          key: 'id',
        },
        allowNull: false,
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  }
};
