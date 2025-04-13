'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Сначала удаляем дефолтное значение
    await queryInterface.changeColumn('user_task', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: null, // Убираем дефолтное значение
    });

    // 2. Меняем тип на ENUM без дефолтного значения
    await queryInterface.changeColumn('user_task', 'status', {
      type: Sequelize.ENUM('NEW', 'REOPENED', 'RESOLVED', 'CLOSED'),
      allowNull: false,
    });

    // 3. Устанавливаем новое дефолтное значение
    await queryInterface.changeColumn('user_task', 'status', {
      type: Sequelize.ENUM('NEW', 'REOPENED', 'RESOLVED', 'CLOSED'),
      allowNull: false,
      defaultValue: 'NEW',
    });
  },

  async down(queryInterface, Sequelize) {
    // Возвращаем как было
    await queryInterface.changeColumn('user_task', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pending',
    });
  }
};