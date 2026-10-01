import bcrypt from "bcrypt";
const plainPassword = "admin@123";

const hashed = await bcrypt.hash(plainPassword, 10);
console.log(hashed);

const isMatch = await bcrypt.compare(plainPassword, hashed);
console.log(isMatch);
