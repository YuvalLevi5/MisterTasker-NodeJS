const express = require('express');
const cors = require('cors');
const path = require('path')

const logger = require('./services/logger.service');
const socketService = require('./services/socket.service');

const taskRoutes = require('./api/task/task.routes');

const app = express();
const http = require('http').createServer(app);
require('dotenv').config();

// const {runWorker} = require('./services/tasker.mngr');
// app.use(express.json()); // create the req.body object - from json
// app.use(express.static('public'))
app.use(express.static('public'))
app.use(express.json())
// app.use(express.urlencoded({extended: false})); // create the req.body object

// const corsOptions = {
//   origin: [
//     'http://127.0.0.1:3000',
//     'http://localhost:3000',
//     'http://127.0.0.1:8080',
//     'http://localhost:8080',
//   ],
//   credentials: true,
// };
// app.use(cors(corsOptions));
// if (process.env.NODE_ENV === 'production') {
//   console.log("production")
//   app.use(express.static(path.resolve(__dirname, 'public')))
// } else {
//   console.log("DEV")
//   const corsOptions = {
//       origin: ['http://127.0.0.1:5173', 'http://127.0.0.1:8080',
//           'http://localhost:8080', 'http://127.0.0.1:3000',
//           'http://localhost:3000', 'http://127.0.0.1:3030',
//           'http://localhost:3030', 'http://localhost:5173'],
//       credentials: true
//   }
//   app.use(cors(corsOptions))
  
// }
if (process.env.NODE_ENV === 'production') {
  console.log("production")
  app.use(express.static(path.resolve(__dirname, 'public')))
} else {
  console.log("DEV")
  const corsOptions = {
      origin: ['http://127.0.0.1:5173', 'http://127.0.0.1:8080',
          'http://localhost:8080', 'http://127.0.0.1:3000',
          'http://localhost:3000', 'http://127.0.0.1:3030',
          'http://localhost:3030', 'http://localhost:5173'],
      credentials: true
  }
  app.use(cors(corsOptions))
}



app.use('/api/task', taskRoutes);
socketService.init(http);

app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})


const port = process.env.PORT || 3030;
http.listen(port, () => {
  logger.info('Server is running on port: ' + port);
});
