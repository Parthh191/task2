const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Blog = sequelize.define('Blog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
});

Blog.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
User.hasMany(Blog, { foreignKey: 'authorId' });

module.exports = Blog;