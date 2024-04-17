'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class geodata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  geodata.init(
    {
      file_name: DataTypes.STRING,
      data: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: 'geodata',
    },
  );
  return geodata;
};
