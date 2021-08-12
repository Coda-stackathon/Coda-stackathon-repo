const Sequelize = require('sequelize')
const db = require('../db')

const Group = db.define('group', {

  name: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'My Snippets'
  },

  imgUrl: {
    type: Sequelize.STRING,
    defaultValue: 'https://pbs.twimg.com/profile_images/3100168478/20aea1ef732e8c5e68634dcb8236b4ef.jpeg'
  },

  description: {
    type: Sequelize.TEXT,
  },

  visibility: {
      type: Sequelize.ENUM('public', 'private'),
      defaultValue: 'private'
  }

})

module.exports = Group