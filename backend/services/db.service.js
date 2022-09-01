
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

// Connection URL

const url = 'mongodb+srv://yuvallevi5:21227159@cluster0.xabqg.mongodb.net/?retryWrites=true&w=majority'

// Database Name
const dbName = 'tasks_db';

var dbConn = null;

async function connect() {
    if (dbConn) return dbConn;
    try {
        console.log(`mongodb+srv://${process.env.NODE_JS_API_KEY}@cluster0.xabqg.mongodb.net/?retryWrites=true&w=majority`)
        const client = await MongoClient.connect(url, { useUnifiedTopology: true }, { useNewUrlParser: true });
        const db = client.db(dbName);
        dbConn = db;
        console.log('DB connected!')
        return db;
    } catch (err) {
        console.log('Cannot Connect to DB', err)
        throw err;
    }
}


async function getCollection(collectionName) {
    const db = await connect()
    return db.collection(collectionName);
}

function toObjectId(id) {
    return new ObjectId(id)
}

module.exports = {
    toObjectId,
    getCollection
}