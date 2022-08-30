const socketio = require('socket.io');
module.exports = {
  notifyTaskUpdated,
  init,
  setToggleWorker,
  setTasks,
}

let gIo

function init(httpServer, corsOptions) {
  gIo = socketio(httpServer, {
    cors: {
      ...corsOptions,
      methods: ["GET", "POST"]
    }
  })
  gIo.on('connection', socket => {
    console.info(`Socket ${socket.id} has connected to tasks namesapce`)
    
    socket.on("disconnect", () => {
      console.info(`Socket ${socket.id} has disconnected from tasks.`)
    });
  })
}


function notifyTaskUpdated(task) {
  gIo && gIo.emit("taskUpdated", task)
}

function setToggleWorker(status) {
  if(gIo) gIo.emit("setToggleWorker", status)
  // gIo && gIo.emit("setToggleWorker", status)
}

function setTasks() {
  if(gIo) gIo.emit("setTasks")
}

// function loadTasksAgain(tasks) {
//   console.log('tasks: ' , tasks)
//   if(gIo) gIo.emit("loadTasksForAllUsers", tasks)
//   // gIo && gIo.emit("setToggleWorker", status)
// }




































// function registerHandlers1(io, socket) {
//   socket.on("task updated", () => {
//   }); 

//   socket.on("task added", () => {
//   }); 

//   socket.on("task added", () => {
//   }); 
// }

// module.exports = {
//   initSocket(httpServer, corsOptions) {
//     io = socketio(httpServer, {
//       cors: {
//         ...corsOptions,
//         methods: ["GET", "POST"]
//       }
//     })

//     const onConnection = (socket) => {
//       console.info(`Socket ${socket.id} has connected to root namesapce`);
//       // registerHandlers1(io, socket);
//       // registerHandlers2(io, socket);

//       // socket.on('task updated',(task)=>{
//       //   socket.emit('task updated',task)
//       // })

//       socket.on('disconnect', () => {
//         console.info(`Socket ${socket.id} has disconnected.`);
//       });      
//     }

//     io.on("connection", onConnection);

//     taskSocket.init(io)
//   },
// }