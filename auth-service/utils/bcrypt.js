import bcrypt from "bcryptjs";

const securePassword = async (password) => {
  try {
    let hashed = await bcrypt.hash(password, 10);
    return hashed;
  } catch (error) {
    console.log(error.message);
  }
};

export default securePassword