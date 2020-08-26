'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('documents', 'commentPositions', {
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
    await queryInterface.removeColumn('documents', 'commentPositions');
    await queryInterface.removeColumn('comments', 'resolvedById');
  }
};
