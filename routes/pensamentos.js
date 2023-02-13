const express = require('express')
const router = express.Router()
const PensamentosControllers = require("../controllers/PensamentosControllers")

const checkAuth = require('../helpers/auth').checkAuth

router.get('/add', checkAuth,  PensamentosControllers.createPensamento)
router.post('/add', checkAuth,  PensamentosControllers.createPensamentoCreate)
router.get('/edit/:id', checkAuth,  PensamentosControllers.updatePensamento)
router.post('/edit', checkAuth,  PensamentosControllers.updatePensamentoFinal)
router.get('/dashboard', checkAuth,  PensamentosControllers.dashboard)
router.post('/remove', checkAuth,  PensamentosControllers.remove)
router.get('/', PensamentosControllers.showPensamentos)

 


module.exports = router