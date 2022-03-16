import express from "express";
const {Router} = express;
const router = new Router();

import upload from "../utils/multer.js";
import passport from "../utils/passport.js";

import log4js from "../utils/logger.js";
const loggerRoute = log4js.getLogger("routeNotExist");

router.post(
	"/login",
	passport.authenticate("local-login", {
		successRedirect: "/api/products",
		failureRedirect: "/failLogin",
	})
);
// Solo quiero guardar el file si el usuario se crea una cuenta.
router.post(
	"/signup",
	upload.single("userPhoto"),
	passport.authenticate("local-signup", {
		successRedirect: "/login",
		failureRedirect: "/failSignup",
	})
);

router.get("/", (req, res) => {
	try {
		res.render("pages/signup");
	} catch (error) {
		loggerRoute.warn(error);
	}
});

router.get("/login", (req, res) => {
	try {
		res.render("pages/login");
	} catch (error) {
		loggerRoute.warn(error);
	}
});

router.get("/failLogin", (req, res) => {
	try {
		res.render("pages/failLogin");
	} catch (error) {
		loggerRoute.warn(error);
	}
});

router.get("/failSignup", (req, res) => {
	try {
		res.render("pages/failSignup");
	} catch (error) {
		loggerRoute.warn(error);
	}
});

router.post("/logout", (req, res) => {
	try {
		let nameUser = req.user.userName;
		req.logout();
		res.render("pages/logout", {nameUser});
	} catch (error) {
		loggerRoute.warn(error);
	}
});

export default router;
