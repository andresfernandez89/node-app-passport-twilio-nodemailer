import express from "express";
const {Router} = express;
const router = new Router();

import log4js from "../utils/logger.js";
const loggerRoute = log4js.getLogger("routeNotExist");

router.get("/profile", async (req, res) => {
	try {
		const dataUser = req.user;
		if (dataUser)
			res.render("pages/userProfile", {
				dataUser: dataUser,
			});
		return;
	} catch (error) {
		loggerRoute.warn(error);
		res.json({
			error: -1,
			descripcion: `route ${req.url} method '${req.method}' not authorized`,
		});
	}
});

export default router;
