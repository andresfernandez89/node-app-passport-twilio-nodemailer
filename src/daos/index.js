let usersDao;
let productsDao;
let cartsDao;
let ordersDao;
let env = "mongodb";

switch (env) {
	case "mongodb":
		const {default: UsersDaoMongoDB} = await import("./users/UsersDaoMongoDB.js");
		const {default: ProductsDaoMongoDB} = await import("./products/ProductsDaoMongoDB.js");
		const {default: CartsDaoMongoDB} = await import("./carts/CartsDaoMongoDB.js");
		const {default: OrdersDaoMongoDB} = await import("./orders/OrdersDaoMongoDB.js");
		usersDao = new UsersDaoMongoDB();
		productsDao = new ProductsDaoMongoDB();
		cartsDao = new CartsDaoMongoDB();
		ordersDao = new OrdersDaoMongoDB();
		break;

	default:
		break;
}

export {usersDao, productsDao, cartsDao, ordersDao};
