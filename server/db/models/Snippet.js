const Sequelize = require('sequelize')
const db = require('../db')

const Snippet = db.define('snippet', {

  name: {
    type: Sequelize.STRING,
    allowNull: false
  },

  description: {
    type: Sequelize.TEXT,
  },

  visibility: {
      type: Sequelize.ENUM('public', 'private'),
      defaultValue: 'public'
  },

  contentHTML: {
      type: Sequelize.TEXT
  },

  contentCSS: {
      type: Sequelize.TEXT
  },

  contentJS: {
      type: Sequelize.TEXT
  }

})

module.exports = Snippet