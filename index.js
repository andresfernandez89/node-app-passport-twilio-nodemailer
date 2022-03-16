//Express
import express from "express";

//Cluster
import cluster from "cluster";
import {cpus} from "os";
const numCPUs = cpus().length;

//Dotenv
import "dotenv/config";
import config from "./src/config.js";

//Minimist
import parseArg from "minimist";

//Logger
import log4js from "./src/utils/logger.js";
const logger = log4js.getLogger();
const loggerApi = log4js.getLogger("apisError");
//Sessions

import session from "express-session";
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true};

//Passport
import passport from "passport";

//MongoDB
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

//Auth
import authorize from "./src/utils/auth.js";

//Routes
import sessionRoutes from "./src/routes/auth.js";
import productsRoutes from "./src/routes/products.js";
import cartRoutes from "./src/routes/cart.js";
import userRoutes from "./src/routes/user.js";

const {PORT, SERVER} = parseArg(process.argv.slice(2), {
	default: {PORT: process.env.PORT, SERVER: "FORK"},
});

if (cluster.isPrimary && SERVER === "CLUSTER") {
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	cluster.on("exit", (worker, code, signal) => logger.info(`Worker ${worker.process.pid} died.`));
} else {
	const app = express();
	//Engine
	app.set("views", process.cwd() + "/src/views");
	app.set("view engine", "ejs");

	//Middleware
	app.use(express.json());
	app.use(express.urlencoded({extended: true}));
	app.use(express.static(process.cwd() + "/public"));
	app.use(
		session({
			secret: config.mongoDB.secret,
			store: MongoStore.create({
				mongoUrl: config.mongoDB.cnx,
				mongoOptions: advancedOptions,
			}),
			resave: true,
			saveUninitialized: true,
			rolling: true,
			cookie: {maxAge: 600000},
		})
	);
	app.use(passport.initialize());
	app.use(passport.session());
	app.use("/", sessionRoutes);
	app.use("/api/products", authorize, productsRoutes);
	app.use("/api/cart", authorize, cartRoutes);
	app.use("/api/user", authorize, userRoutes);

	app.use(function (req, res, next) {
		res
			.status(404)
			.json({error: -2, descripcion: `ruta ${req.url} método '${req.method}' no implementada`});
	});

	const server = app.listen(PORT, async () => {
		await mongoose.connect(config.mongoDB.cnx, config.mongoDB.options);
		logger.info(`Servidor http escuchando en el puerto: ${server.address().port}`);
		logger.info("Database Connected");
	});

	server.on("error", (error) => loggerApi.error(`Error en servidor: ${error}`));
}
