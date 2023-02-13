const {DataTypes} = require('sequelize')

const db = require('../db/conn')

//USER
const User = require('./User')

const Pensamentos = db.define('pensamentos', {
        title: {
              type: DataTypes.STRING,
              allowNull: false,
              require: true
        }
})


Pensamentos.belongsTo(User)
User.hasMany(Pensamentos)


module.exports = Pensamentos