import axios from 'axios'
import { httpService } from './http.service.js'

export const taskService = {
  getTasks,
  getById,
  remove,
  save,
  startTask,
  generateTasks,
  clearTasks,
  toggleWorker,
  getWorkerStatus,
  getEmptyTask,
}

async function getTasks(filterBy = { sortTxt: 'title', sortDir: 1 }) {
  return httpService.get(`/`, filterBy)
}

async function getById(id) {
  const res = httpService.get(`/${id}`)
  return res.data
}

async function remove(id) {
  return httpService.delete(`/${id}`)
}


async function _update(task) {
  return httpService.put(`/${task._id}`, task)
}

async function _add(task) {
  return httpService.post(`/`, task)

}

async function generateTasks() {
  return httpService.get('/generate')
}

async function clearTasks() {
  return httpService.delete('/')
}

function save(task) {
  return task._id ? _update(task) : _add(task)
}

async function startTask(task) {
  return httpService.post(`/${task._id}/start`)
}

function toggleWorker(){
  return httpService.post('/toggle')
}

function getWorkerStatus() {
  return httpService.get('/workerStatus')
}

function getEmptyTask() {
  return {
    title: "",
    importance: 1,
  }
}
