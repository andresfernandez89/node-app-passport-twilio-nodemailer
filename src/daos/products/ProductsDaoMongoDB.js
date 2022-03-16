import ContainerMongoDB from "../../containers/ContainerMongoDB.js";

export default class ProductsDaoMongoDB extends ContainerMongoDB {
	constructor() {
		super("product", {
			title: {type: String, required: true},
			description: {type: String, required: true},
			code: {type: Number, required: true, unique: true, min: 0},
			thumbnail: {type: String, required: true},
			price: {type: Number, required: true, min: 0},
			stock: {type: Number, required: true},
			timestamps: {type: Date},
		});
	}
}
