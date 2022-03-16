import twilio from "twilio";
import config from "../config.js";

const client = twilio(config.twilio.accountSid, config.twilio.authToken);

export default client;

/* try {
    const message = await client.messages.create({
        body: "Hi I am a WhatsApp messagge from Node.js!",
        mediaUrl: ["https://bit.ly/whatsapp-image-example"],
        from: "whatsapp:+14155238886",
        to: "whatsapp:+5492236150380",
    });
    res.send({data: message});
    console.log("Message OK!");
} catch (error) {
    console.log(err);
} */

/* const message = await client.messages.create({
    body: 'Hola soy un SMS desde Node.js!',
    from: '+14156884237',
    to: '+541199998888'
 }) */
