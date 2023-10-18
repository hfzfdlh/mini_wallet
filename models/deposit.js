'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Deposit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Deposit.belongsTo(models.Wallet,{foreignKey:'deposited_by'})
    }
  }
  Deposit.init({
    status: DataTypes.STRING,
    deposited_at: DataTypes.DATE,
    amount: DataTypes.INTEGER,
    deposited_by: DataTypes.INTEGER,
    reference_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Deposit',
  });
  return Deposit;
};