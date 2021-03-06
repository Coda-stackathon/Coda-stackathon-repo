const Sequelize = require('sequelize')
const db = require('../db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const axios = require('axios');
const Group = require('./Group');

if(process.env.NODE_ENV !== 'production') {
  require('../../../secrets')
}

const SALT_ROUNDS = 5;

const User = db.define('user', {

  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },

  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },

  password: {
    type: Sequelize.STRING,
  },

  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }

})

module.exports = User

/**
 * instanceMethods
 */
User.prototype.correctPassword = async function(candidatePwd) {
  //we need to compare the plain version to an encrypted version of the password
  return bcrypt.compare(candidatePwd, this.password);
}

User.prototype.generateToken = function() {
  return jwt.sign({id: this.id}, process.env.JWT)
}

/**
 * classMethods
 */
User.authenticate = async function({ username, password }){
    const user = await this.findOne({where: { username }})
    
    if (!user || !(await user.correctPassword(password))) {
      const error = Error('Incorrect username/password');
      error.status = 401;
      throw error;
    }
    return user.generateToken();
};

User.findByToken = async function(token) {
  try {
    const {id} = await jwt.verify(token, process.env.JWT)
    const user = User.findByPk(id, {include: {all: true, nested: true}})
    if (!user) {
      throw 'nooo'
    }
    return user
  } catch (ex) {
    const error = Error('bad token')
    error.status = 401
    throw error
  }
}

/**
 * hooks
 */
const hashPassword = async(user) => {
  //in case the password has been changed, we want to encrypt it with bcrypt
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
  }
}

const createGroup = async(user) => {
  const group = await Group.create()
  await user.addGroup(group)
}


User.beforeCreate(hashPassword)
User.afterCreate(createGroup)
User.beforeUpdate(hashPassword)
User.beforeBulkCreate(users => Promise.all(users.map(hashPassword)))
