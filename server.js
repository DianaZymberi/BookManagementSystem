require("dotenv").config();
const express = require("express");
const http = require("http");
const cluster = require("cluster");
const os = require("os");
const cors = require("cors");
const connection = require("./src/config/database.config");
const { swaggerUi, specs } = require("./src/config/swagger.config");
const userRoute = require("./src/routes/user.route");
const booksRoute = require("./src/routes/books.route")

const numCPUs = os.cpus().length;
const port = process.env.PORT || 5000;
const isClusterEnabled = process.env.CLUSTER_ENABLED === "true";

if (isClusterEnabled && cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Spawning a new process...`);
    cluster.fork();
  });
} else {
  const app = express();
  const server = http.createServer(app);

  /** Middleware */
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  module.exports = app;
  /** API Routes */
  app.use("/api/users", userRoute);
  app.use('/api/books', booksRoute);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

  /** CORS Headers */
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
  });

  /** Start Server */
  server.listen(port, () => {
    console.log(`Worker ${process.pid} listening on port ${port}`);
  });
}

 // Export app for testing