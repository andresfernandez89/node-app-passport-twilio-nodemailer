import ContainerMongoDB from "../../containers/ContainerMongoDB.js";

export default class UsersDaoMongoDB extends ContainerMongoDB {
	constructor() {
		super("user", {
			userEmail: {type: String, required: true, unique: true},
			password: {type: String, required: true},
			userName: {type: String, required: true},
			userAge: {type: Number, required: true, min: 0},
			userPhone: {type: Number, required: true},
			userAddress: {type: String, required: true},
			userRole: {type: String, enum: ["user", "admin"], default: "user"},
			timestamps: {type: Date},
			userPhoto: {type: String, required: true},
		});
	}

	async findUser(username) {
		const user = await this.collection.findOne({userEmail: username});
		return user;
	}
}
