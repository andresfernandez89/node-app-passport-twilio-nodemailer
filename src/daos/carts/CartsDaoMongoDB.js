import ContainerMongoDB from "../../containers/ContainerMongoDB.js";

import log4js from "../../utils/logger.js";
const logger = log4js.getLogger();
const loggerApi = log4js.getLogger("apisError");

export default class CartsDaoMongoDB extends ContainerMongoDB {
	constructor() {
		super("cart", {
			timestamps: {type: Date},
			userId: {type: String, required: true, unique: true},
			product: Array,
		});
	}

	async getByUserId(id) {
		try {
			const data = await this.getAll();
			if (data) {
				let obj = await this.collection.find({userId: id}, {__v: 0});
				if (obj) return obj[0];
				return null;
			}
		} catch (error) {
			loggerApi.error("The file cannot be read.");
		}
	}

	async addProduct(id, newProduct) {
		try {
			const cart = await this.getById(id);
			cart.product.push(newProduct);
			if (cart) {
				const data = await this.collection.findByIdAndUpdate(
					id,
					{$set: {product: cart.product}},
					{
						new: true,
					}
				);
				logger.info(data.product);
			}
		} catch (error) {
			loggerApi.error("The file cannot be written.");
		}
	}
	async deleteProduct(id, id_prod) {
		try {
			const cart = await this.getById(id);
			if (cart) {
				let prFind = await cart.product.filter((element) => element._id != id_prod);
				console.log(prFind);
				cart.product = prFind;
				this.editById(id, cart);
			}
		} catch (error) {
			loggerApi.error("The file cannot be written.");
		}
	}
}
