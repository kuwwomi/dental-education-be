"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Prediction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Prediction.init(
    {
      name: DataTypes.STRING,
      age: DataTypes.INTEGER,
      state: DataTypes.STRING,
      semester: DataTypes.INTEGER,
      average_cgpa: DataTypes.FLOAT,
      final_cgpa: DataTypes.FLOAT,
      result: DataTypes.STRING,
      type: DataTypes.STRING,
      predictor_email: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Prediction",
    }
  );
  return Prediction;
};
