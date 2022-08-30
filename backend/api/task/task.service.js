const { getCollection, toObjectId } = require('../../services/db.service')
const { getDateISO, getRandomInt } = require('../../services/util.service')

const { execute } = require('../../services/externalService');
const { notifyTaskUpdated , setTasks } = require('../../services/socket.service.js')


const COLLECTION_NAME = 'tasks';

const TASK_STATUSES = {
    new: 'new',
    running: 'running',
    done: 'done',
    fail: 'fail'
}

module.exports =  {
    remove,
    get,
    update,
    query,
    add,
    performTask,
    getNextTask,
    generateTasks,
    removeAll
};

async function remove(taskId) {
    // console.log('task::remove');
    const collection = await getCollection(COLLECTION_NAME)
    const { result } = await collection.deleteOne({ _id: toObjectId(taskId) })
    setTasks()
    return result.n > 0
}

async function get(taskId) {
    console.log('task::get', taskId);
    const collection = await getCollection(COLLECTION_NAME)
    return collection.findOne({ _id: toObjectId(taskId) })
}

async function update(task) {
    console.log('task::update', task._id);
    const collection = await getCollection(COLLECTION_NAME)

    const updatedTask = {
        ...task,
        updatedAt: getDateISO(),
        _id: toObjectId(task._id)
    }

    await collection.updateOne({ _id: updatedTask._id }, { $set: updatedTask })


    notifyTaskUpdated(updatedTask)
    return updatedTask;
}

async function query(filterBy) {
    try {
        const { sortTxt, sortDir } = filterBy
        const criteria = _buildCriteria(filterBy)
        const collection = await getCollection(COLLECTION_NAME)
        return collection.find(criteria).sort({ [sortTxt]: +sortDir || 1 }).toArray()

    } catch (err) {
        console.log(err);
    }
}

async function getNextTask() {
    const collection = await getCollection(COLLECTION_NAME)
    try {
        const tasks = await collection.find({
            $and: [
                { doneAt: null },
                { triesCount: { $lt: 5 } },
                { status: { $ne: TASK_STATUSES.running } }
            ]
        })
            .sort({ "triesCount": 1, "importance": -1 })
            .toArray()
        return tasks[0]
    } catch (err) {
        logger.error('Cannot get next task', err)
        return null
    }
}

async function add(task) {
    const collection = await getCollection(COLLECTION_NAME)
    const taskModel = _createTaskModel(task)
    taskModel.createdAt = getDateISO()
    taskModel.updatedAt = null
    const doc = await collection.insertOne(taskModel)
    setTasks()
    // returns the inserted object.
    return doc.ops[0]
}

async function performTask(task) {
    if (!task) return Promise.reject('No Task Found')
    try {
        console.log('performTask', task._id);
        task.status = TASK_STATUSES.running
        update(task)
        await execute(task)

        // update task for success
        task.doneAt = getDateISO()
        task.status = TASK_STATUSES.done
        console.log('performTask:done');
    } catch (error) {
        // update task for error
        console.log(`There is and error while processing task id: ${task._id}`);
        task.errors.push(error)
        task.status = TASK_STATUSES.fail
        task.triesCount++
        console.log('performTask:error', error);
    } finally {
        // more updates for task
        task.lastTried = getDateISO()
        console.log('performTask:finished');
        return update(task)
    }
}

function generateTasks() {
    var newTasks = []
    const words = ["The sky", "above", "the port", "was", "the color of television", "tuned", "to", "a dead channel", "All", "this happened", "more or less", "I", "had", "the story", "bit by bit", "from various people", "and", "as generally", "happens", "in such cases", "each time", "it", "was", "a different story", "It", "was", "a pleasure", "to", "burn"];

    for (let i = 0; i < 10; i++) {
        // generate title
        let wordsCount = getRandomInt(1, 5)
        let title = ''
        for (let j = 0; j < wordsCount; j++) {
            title += " " + words[getRandomInt(0, words.length)]
        }

        // generate description
        wordsCount = getRandomInt(1, 15)
        let description = ''
        for (let j = 0; j < wordsCount; j++) {
            description += " " + words[getRandomInt(0, words.length)]
        }

        const importance = getRandomInt(1, 5)

        newTasks.push(add({ title, description, importance }))
    }
    return newTasks
}

async function removeAll() {
    const collection = await getCollection(COLLECTION_NAME)
    const res = await collection.deleteMany({})
    return res
}

function _createTaskModel({ title, description="This is task description", importance }) {
    return {
        title,
        description,
        importance,
        createdAt: null,
        updatedAt: null,
        lastTried: null,
        errors: [],
        triesCount: 0,
        doneAt: null,
        status: TASK_STATUSES.new
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.title) {
        const txtCriteria = { $regex: filterBy.title, $options: 'i' }
        // criteria.title = txtCriteria
        criteria.$or = [
            {
                title: txtCriteria
            },
            {
                description: txtCriteria
            }
        ]
    }
    if (filterBy.importance) {
        filterBy.importance = filterBy.importance.map(str => parseInt(str))
        criteria.importance = { $in: filterBy.importance }
    }
    if (filterBy.status) {
        criteria.status = { $in: filterBy.status }
    }
    return criteria
}

async function _clear() {
    const collection = await getCollection('task')
    collection.remove()
}

// _clear()
// generateTasks()



// async function performTask(task) {
//     try {
//         // TODO: update task status to running and save to DB
//         // TODO: execute the task
//         // TODO: update task for success (doneAt, status)
//     } catch (error) {
//         // TODO: update task for error: status, triesCount, errors
//     } finally {
//         // TODO: update task lastTried and save to DB
//     }
// }