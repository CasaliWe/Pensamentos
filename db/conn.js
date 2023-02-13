const {Sequelize} = require("sequelize")

require('dotenv').config()



const sequelize = new Sequelize(process.env.NOMEBANCO, process.env.USERBANCO, process.env.SENHABANCO, {
        host:process.env.HOST,
        dialect: process.env.MODELO
})

try{
      sequelize.authenticate()
      console.log('Conctado!')
}catch(err){
        console.log(err)
}

module.exports = sequelize