'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('documents', 'comments', {
      type: Sequelize.JSON
    });
    await queryInterface.addColumn('comments', 'resolvedById', {
      type: Sequelize.UUID,
      references: {
        model: "users"
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('documents', 'comments');
    await queryInterface.removeColumn('comments', 'resolvedById');
  }
};
