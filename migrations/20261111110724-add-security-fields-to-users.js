'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable('Users');

    if (!tableDesc.failedAttempts) {
      await queryInterface.addColumn('Users', 'failedAttempts', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      });
    }

    if (!tableDesc.lockUntil) {
      await queryInterface.addColumn('Users', 'lockUntil', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'failedAttempts');
    await queryInterface.removeColumn('Users', 'lockUntil');
  },
};
