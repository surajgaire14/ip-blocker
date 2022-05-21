const dotenv = require("dotenv");
const cluster = require("node:cluster");
const http = require("node:http");
const numCPUs = require("node:os").cpus().length;
const process = require("node:process");

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = require('./app')

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) cluster.fork();

  cluster.on("exit", (worker, code, signal) =>
    console.log(`worker ${worker.process.pid} died`)
  );
} else {
  http
    .createServer(app)
    .listen(PORT, err => {
        if(err) throw new Error(err);
        console.log(`Server Running => http://localhost:${PORT}`);
    });

  console.log(`Worker ${process.pid} started`);
}
