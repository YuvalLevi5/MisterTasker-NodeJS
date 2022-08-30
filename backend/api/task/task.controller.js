const taskService = require('./task.service')
const taskWorker = require('../../services/task.worker.js')
const socketService = require('../../services/socket.service')
const logger = require('../../services/logger.service')

async function query(req, res) {
    try {
        const tasks = await taskService.query(req.query)
        res.json(tasks);
    } catch (err) {
        res.status(500).json({
            err
        })
    }
}
async function get(req, res) {
    try {
        const task = await taskService.get(req.params.id)
        res.json(task);
    } catch (err) {
        res.status(500).json({
            err
        })
    }
}
async function add(req, res) {
    const task = req.body;
    try {
        const newTask = await taskService.add(task)
        res.json(newTask);
    } catch (err) {
        res.status(500).json({
            err
        })
    }
}
async function remove(req, res) {
    try {
        await taskService.remove(req.params.id)
        res.json({
            success: true
        });
    } catch (err) {
        res.status(500).json({
            err
        })
    }
}
async function update(req, res) {
    const task = req.body;
    try {
        const updatedTask = await taskService.update(task)
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({
            err
        })
    }
}

async function start(req, res) {
    try {
        const currTask = await taskService.get(req.params.id)
        const task = await taskService.performTask(currTask)
        res.json(task)
    } catch (err) {
        res.status(500).json({
            err
        })
    }
}

async function generate(req,res){
    try {
        const newTasks = await taskService.generateTasks()
        res.json(newTasks)
    } catch{
        console.log('Failed to generate new tasks');
    }
}

async function removeAll(req,res){
    try {
        const removedTasks = await taskService.removeAll()
        res.json(removedTasks)
    } catch {
        console.log('Couldn\'t remove tasks');
    }
}

async function workerStatus(req, res) {
    try {
        const status = await taskWorker.getWorkerStatus()
        res.json(status)
    } catch {
        console.log('Couldn\'t find is worker on');
    }
}   


module.exports = {
    add,
    query,
    get,
    remove,
    update,
    start,
    generate,
    removeAll,
    workerStatus
}