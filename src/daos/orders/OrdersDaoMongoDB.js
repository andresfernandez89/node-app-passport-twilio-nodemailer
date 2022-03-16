import ContainerMongoDB from "../../containers/ContainerMongoDB.js";

export default class OrdersDaoMongoDB extends ContainerMongoDB {
	constructor() {
		super("order", {
			timestamps: {type: Date},
			userId: {type: String, required: true},
			products: Array,
		});
	}
}
