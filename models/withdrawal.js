'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Withdrawal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Withdrawal.belongsTo(models.Wallet, {foreignKey: 'withdrawn_by'})
    }
  }
  Withdrawal.init({
    status: DataTypes.STRING,
    withdrawn_at: DataTypes.DATE,
    amount: DataTypes.INTEGER,
    withdrawn_by: DataTypes.INTEGER,
    reference_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Withdrawal',
  });
  return Withdrawal;
};