import {createTransport} from "nodemailer";

import config from "../config.js";

const transporter = createTransport(config.nodemailer);

export default transporter;
