const Sequelize = require('sequelize')
const db = require('../db')

const Preset = db.define('preset', {

  name: {
    type: Sequelize.STRING,
    allowNull: false
  },

  content: {
    type: Sequelize.TEXT,
  },

})

module.exports = Preset