const express = require('express')
const { add, query, get, remove, update, start, generate, removeAll , workerStatus } = require('./task.controller')
const { toggleWorker } = require('../../services/task.worker.js')
const router = express.Router()

router.get('/', query)
router.get('/generate', generate)
router.get('/workerStatus', workerStatus)
router.post('/toggle', toggleWorker)
router.get('/:id', get)
router.post('/', add)
router.put('/:id', update)
router.delete('/', removeAll)
router.delete('/:id', remove)
router.post('/:id/start', start)

module.exports = router
