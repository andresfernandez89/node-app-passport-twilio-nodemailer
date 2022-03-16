import multer from "multer";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/uploads/avatar/");
	},
	filename: function (req, file, cb) {
		cb(null, `${req.body.userName}.${file.originalname.split(".").pop()}`);
	},
});

const upload = multer({storage});

export default upload;
