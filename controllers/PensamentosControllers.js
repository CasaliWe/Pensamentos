const Pensamentos = require('../models/Pensamentos')
const UserPensamentos = require('../models/User')

const {Op} = require('sequelize')


module.exports = class PensamentosController { 

       static async showPensamentos(req, res){

              let search = ''

              if(req.query.search){
                   search = req.query.search     
              }


              let order = 'DESC'

              if(req.query.order === 'old'){
                     order = 'ASC'
              } else {
                     order = 'DESC'
              }



              const pensamentosUsers = await Pensamentos.findAll({include: UserPensamentos, where: {title: {[Op.like]: `%${search}%`}}, order: [['createdAt', order]]})

              const pensamentoss = pensamentosUsers.map((result)=> result.get({plain:true}))

              let qtsPensamentos = pensamentoss.length
              
              res.render('pensamentos/home', {pensamentoss, search, qtsPensamentos})
       }





       static async dashboard(req, res){
              const userid = req.session.userid
              
              const user = await UserPensamentos.findOne({where:{id: userid}, include: Pensamentos, plain:true})

              if(!user){
                     res.redirect('/login')
                     return
              }

              const pensamentos = user.pensamentos.map((result)=> result.dataValues)

              let semPensamentos = false

              if(pensamentos.length === 0){
                     semPensamentos = true 
              }

              res.render('pensamentos/dashboard', {pensamentos, semPensamentos})
       }

       static createPensamento(req,res){
              res.render('pensamentos/create')
       }

       static async createPensamentoCreate(req, res){

                   const pensamento = {
                        title: req.body.title,
                        UserId: req.session.userid
                   }

                   try{
                     await Pensamentos.create(pensamento)

                     req.flash('message', 'Pesamento criado com sucesso!')
                     req.session.save(()=>{
                     res.redirect('/pensamentos/dashboard')
                     })
                   } catch(err){
                         console.log(err)
                   }
       }

       static async remove(req,res){
              
              const id = req.body.id
              const UserId = req.session.userid

              try{
                  await Pensamentos.destroy({where:{id:id, UserId: UserId}})

                  req.flash('message', 'Removido com sucesso!')
                  req.session.save(()=>{
                  res.redirect('/pensamentos/dashboard')
                  })
              }catch(err){
                     console.log(err)
              }
              
       }

       static async updatePensamento(req,res){
               
              const id = req.params.id

              const pensamento = await Pensamentos.findOne({where:{id:id}, raw:true})

              console.log(pensamento)

              res.render('pensamentos/update', {pensamento})

       }

       static async updatePensamentoFinal(req,res){

              const id = req.body.id
                 
              const pesamento = {
                     title: req.body.title,

              }

              await Pensamentos.update(pesamento, {where:{id:id}})


              try{
                  req.flash('message', 'Editado com sucesso!')
                  req.session.save(()=>{
                      res.redirect('/pensamentos/dashboard')
                  })
              }catch(err){
                  console.log(err)
              }
       }
}