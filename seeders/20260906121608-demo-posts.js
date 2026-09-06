'use strict';

/** @type {import('sequelize-cli').Seed} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('Posts', [
      {
        content: 'Запуск нового продукта уже на следующей неделе!',
        platform: 'instagram',
        scheduledAt: new Date('2026-09-10T09:00:00.000Z'),
        status: 'scheduled',
        priority: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: 'Итоги квартала: делимся результатами команды.',
        platform: 'telegram',
        scheduledAt: new Date('2026-09-12T15:30:00.000Z'),
        status: 'scheduled',
        priority: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        content: 'Срочный анонс: технические работы в ночь на воскресенье.',
        platform: 'twitter',
        scheduledAt: new Date('2026-09-08T22:00:00.000Z'),
        status: 'scheduled',
        priority: 3,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Posts', null, {});
  },
};
