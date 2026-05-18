import { subscribeToQueue } from "./rabbit.js";
import { sendEmail } from "../utils/email.js";

function startListener() {
  subscribeToQueue("user created", async (msg) => {
    const {
      email,
      role,
      fullname: { firstName, lastName = "" },
    } = msg;

    const template = `
    <h1>Welcome to Spotify Sync</h1>
            <p>Dear ${firstName} ${lastName},</p>
            <p>Thank you for registering with Spotify Sync. We are excited to have you on board!</p>
            <p>Your role is: ${role}</p>
            <p>We hope you enjoy our services.</p>
            <br/>
            <p>Best regards,</p>
            <p>Spotify Sync Team</p>
    `;
    await sendEmail(
      email,
      "Welcome to Spotify-Sync",
      "Thank you for registering with Spotify Sync",
      template,
    );
  });
}

export default startListener;
