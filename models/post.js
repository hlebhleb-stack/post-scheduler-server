'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  const ALLOWED_PLATFORMS = ['instagram', 'telegram', 'vk', 'twitter', 'facebook'];

  Post.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true }
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isIn: [ALLOWED_PLATFORMS] }
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'scheduled'
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: { isIn: [[1, 2, 3]] }
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};