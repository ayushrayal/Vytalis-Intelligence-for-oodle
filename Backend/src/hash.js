import bcrypt from "bcryptjs";

const password = "Oodle@2026";

const hash = await bcrypt.hash(password, 10);

console.log(hash);