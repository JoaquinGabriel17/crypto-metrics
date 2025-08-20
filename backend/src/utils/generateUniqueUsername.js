import User from "../models/User.js";

async function generateUniqueUsername() {
  let username;
  let exists = true;

  while (exists) {
    const randomNum = Math.floor(100000 + Math.random() * 900000); // 6 dígitos
    username = `user${randomNum}`;
    exists = await User.findOne({ name: username });
  }

  return username;
}

export default generateUniqueUsername;
