const User = require("../models/User")


const bcrypt = require('bcryptjs')
const { where } = require("sequelize")



module.exports = class AuthController{
         static login(req, res){
                res.render('auth/login')
         }



         static async loginPost(req, res){
                const {email, password} = req.body


                const user = await User.findOne({where: {email: email}})

                if(!user){
                   req.flash('message', 'Usuário não cadastrado!')
                   res.render('auth/login')

                   return
                }

                const passwordMatch = bcrypt.compareSync(password, user.password)

                if(!passwordMatch){
                  req.flash('message', 'Senha inválida')
                  res.render('auth/login')

                  return
                }
                 
                //Inicializa a sessão
                req.session.userid = user.id

                req.flash('message', 'Logado com sucesso!')

                req.session.save(()=>{
                      res.redirect('/')
                })

         }







         static register(req, res){
            res.render('auth/register')
         }

         static async registerPost(req, res){
               
                const {name, email, password, confirm} = req.body
                
                if(password != confirm){
                       req.flash('message', 'As senhas são diferentes!')
                       res.render('auth/register')

                       return
                }

                const checkEmail = await User.findOne({where: {email: email}})

                if(checkEmail){
                        req.flash('message', 'O email já esta em uso!')
                        res.render('auth/register')

                        return
                }

                
                //CREATE PASSWORD 
                const salt = bcrypt.genSaltSync(10)
                const hashedPassaword = bcrypt.hashSync(password, salt) //senha q o user mandou + essa gerada

                const user = {
                     name,
                     email, 
                     password: hashedPassaword
                }

                try{
                    const createdUser =  await User.create(user)
                     
                    //iniciar sessão
                    req.session.userid = createdUser.id
                    req.session.save(()=>{
                        res.redirect('/')
                    })
                
 
                    req.flash('message', 'Cadastado com sucesso!')
                } catch(err){
                     console.log(err)
                }
         
         }


         static logout(req, res){
               req.session.destroy()
               res.redirect('/login')
         }
}