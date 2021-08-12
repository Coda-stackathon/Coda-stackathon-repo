//this is the access point for all things database related!

const db = require('./db')

const User = require('./models/User')
const Group = require('./models/Group')
const Snippet = require('./models/Snippet')
const Preset = require('./models/Preset')

//associations could go here!


Group.hasMany(Snippet)
Snippet.belongsTo(Group)

User.belongsToMany(Group, {through: 'groupMember'})
Group.belongsToMany(User, {through: 'groupMember'})

User.hasMany(Preset)
Preset.belongsTo(User)

module.exports = {
  db,
  models: {
    User,
    Group,
    Snippet,
    Preset
  },
}
