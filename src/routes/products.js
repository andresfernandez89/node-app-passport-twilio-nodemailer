import express from "express";
const {Router} = express;
const router = new Router();

import {productsDao as productsApi} from "../daos/index.js";
import {cartsDao as cartsApi} from "../daos/index.js";

import log4js from "../utils/logger.js";
const loggerRoute = log4js.getLogger("routeNotExist");

//Get all
router.get("/", async (req, res) => {
	try {
		const {user} = req;
		cartsApi.add({userId: user._id});
		const products = await productsApi.getAll();
		if (products.length > 0) {
			return res.render("pages/home", {
				title: "List of products",
				data: products,
				dataUser: user,
			});
		}
		return res.render("pages/home", {data: false, dataUser: user});
	} catch (error) {
		loggerRoute.warn(error);
		res.json({
			error: -1,
			descripcion: `route ${req.url} method '${req.method}' not authorized`,
		});
	}
});

//Add
router.get("/form", (req, res) => {
	try {
		return res.render("pages/addProduct", {title: "Add Product"});
	} catch (error) {
		loggerRoute.warn(error);
		res.status(401).json({
			error: -1,
			descripcion: `route ${req.url} method '${req.method}' not authorized`,
		});
	}
});
router.post("/add", async (req, res) => {
	try {
		await productsApi.add(req.body);
		res.redirect("/api/products");
	} catch (error) {
		loggerRoute.warn(error);
		res.json({
			error: -1,
			descripcion: `route ${req.url} method '${req.method}' not authorized`,
		});
	}
});

//Get by id
router.get("/:id", async (req, res) => {
	try {
		const product = await productsApi.getById(req.params.id);
		if (product) return res.render("pages/product", {title: "Product Detail", data: product});
	} catch (error) {
		loggerRoute.warn(error);
		res.json({error: -1, descripcion: `route ${req.url} method '${req.method}' not authorized`});
	}
});

//Edit
router.get("/form/:id", async (req, res) => {
	try {
		const product = await productsApi.getById(req.params.id);
		if (product) return res.render("pages/editProduct", {title: "Edit Product", data: product});
	} catch (error) {
		loggerRoute.warn(error);
		res.json({
			error: -1,
			descripcion: `route ${req.url} method '${req.method}' not authorized`,
		});
	}
});

router.put("/:id", async (req, res) => {
	try {
		const productUpd = await productsApi.editById(req.params.id, req.body);
		res.redirect("/api/products"); // No me permite hacer un redirect;
	} catch (error) {
		loggerRoute.warn(error);
		res.json({
			error: -1,
			descripcion: `route ${req.url} method '${req.method}' not authorized`,
		});
	}
});

//Delete
router.delete("/:id", async (req, res) => {
	try {
		await productsApi.deleteById(req.params.id);
		res.redirect("/api/products"); // No me permite hacer un redirect;
	} catch (error) {
		loggerRoute.warn(error);
		res.json({
			error: -1,
			descripcion: `route ${req.url} method '${req.method}' not authorized`,
		});
	}
});

export default router;
