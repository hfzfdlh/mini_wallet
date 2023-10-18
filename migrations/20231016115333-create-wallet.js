'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Wallets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      owned_by: {
        type: Sequelize.STRING,
        references:{
          model:'Customers',
          key:'customer_xid'
        }
      },
      status: {
        type: Sequelize.STRING
      },
      enabled_at: {
        type: Sequelize.DATE
      },
      disabled_at: {
        type: Sequelize.DATE
      },
      balance: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Wallets');
  }
};