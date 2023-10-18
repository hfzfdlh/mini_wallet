'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Wallet.belongsTo(models.Customer,{foreignKey:'owned_by'})
      Wallet.hasMany(models.Transaction, {foreignKey:'wallet_id'})
      Wallet.hasMany(models.Deposit, {foreignKey:'deposited_by'})
      Wallet.hasMany(models.Withdrawal, {foreignKey:'withdrawn_by'})
    }
  }
  Wallet.init({
    owned_by: DataTypes.STRING,
    status: DataTypes.STRING,
    enabled_at: DataTypes.DATE,
    disabled_at: DataTypes.DATE,
    balance: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Wallet',
  });
  return Wallet;
};