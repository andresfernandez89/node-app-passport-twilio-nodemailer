import express from "express";
const {Router} = express;
const router = new Router();

import transporter from "../utils/nodemailer.js";
import client from "../utils/twilio.js";

import {usersDao as usersApi} from "../daos/index.js";
import {cartsDao as cartsApi} from "../daos/index.js";
import {ordersDao as ordersApi} from "../daos/index.js";
import {productsDao as productsApi} from "../daos/index.js";

import log4js from "../utils/logger.js";
const loggerRoute = log4js.getLogger("routeNotExist");

//Add cart
router.post("/", (req, res) => {
	try {
		cartsApi.add({...req.body});
		res.send("Cart Created");
	} catch (error) {
		loggerRoute.warn(error);
		res.status(404).json({
			error: -2,
			descripcion: `route ${req.url} method '${req.method}' not authorized`,
		});
	}
});

//Delete cart
router.delete("/:id", (req, res) => {
	try {
		cartsApi.deleteById(req.params.id);
		res.send("Cart Removed");
	} catch (error) {
		loggerRoute.warn(error);
		res.status(404).json({
			error: -2,
			descripcion: `route ${req.url} method '${req.method}' not authorized`,
		});
	}
});

//Get
router.get("/:userId/products", async (req, res) => {
	try {
		let cart = await cartsApi.getByUserId(req.params.userId);
		res.json(cart.product);
	} catch (error) {
		loggerRoute.warn(error);
		res
			.status(404)
			.json({error: -2, descripcion: `route ${req.url} method '${req.method}' not authorized`});
	}
});

//Add product to Cart
router.post("/:id/products", async (req, res) => {
	try {
		const newProduct = await productsApi.getById(req.body.id_newProd);
		await cartsApi.addProduct(req.params.id, newProduct);
		res.send("Product Added");
	} catch (error) {
		loggerRoute.warn(error);
		res.status(404).json({
			error: -2,
			descripcion: `route ${req.url} method '${req.method}' not authorized`,
		});
	}
});

//Delete product of cart
router.delete("/:id/products/:id_prod", (req, res) => {
	try {
		cartsApi.deleteProduct(req.params.id, req.params.id_prod);
		res.send("Product Deleted");
	} catch (error) {
		loggerRoute.warn(error);
		res
			.status(404)
			.json({error: -2, descripcion: `route ${req.url} method '${req.method}' not authorized`});
	}
});

//Make an order
router.post("/:userId/order", async (req, res) => {
	try {
		const user = await usersApi.getById(req.params.userId);
		const cart = await cartsApi.getByUserId(req.params.userId);
		const order = {userId: cart.userId, products: cart.product};
		const newOrder = await ordersApi.add(order);

		//Twilio whatsApp
		const message1 = await client.messages.create({
			body: `New order from ${user.userName}`,
			from: "whatsapp:+14155238886",
			to: "whatsapp:+5492236150380",
		});

		//Twilio SMS
		const message2 = await client.messages.create({
			body: `Your order N°${newOrder._id} is in progress!`,
			from: "+18124899160",
			to: "+5492236150380", //aca pondriamos cel del usuario user.userPhone
		});

		//Nodemailer
		const mailOptions = {
			from: "Servidor Node.js",
			to: "andres_f89@hotmail.com", //aca pondriamos mail del usuario user.userEmail
			subject: `New order from ${user.userName}`,
			html: `<h1 style="color: blue;">New order from ${user.userName}</h1>
			<h2>List of products:</h2>
			${cart.product.map((element) => {
				return `<p>${element.title}</p>`;
			})}`,
		};
		await transporter.sendMail(mailOptions);
		cart.product = [];
		cartsApi.editById(cart._id, cart);
	} catch (error) {
		loggerRoute.warn(error);
		res
			.status(404)
			.json({error: -2, descripcion: `route ${req.url} method '${req.method}' not authorized`});
	}
});

//El email contendrá en su cuerpo la lista completa de productos a comprar y en el asunto la frase 'nuevo pedido de ' y el nombre y email del usuario que los solicitó. En el mensaje de whatsapp se debe enviar la misma información del asunto del email.

//El usuario recibirá un mensaje de texto al número que haya registrado, indicando que su pedido ha sido recibido y se encuentra en proceso.

export default router;
