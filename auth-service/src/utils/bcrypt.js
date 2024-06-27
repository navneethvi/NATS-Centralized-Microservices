import bcrypt from "bcryptjs";

const securePassword = async (password) => {
  try {
    let hashed = await bcrypt.hash(password, 10);
    return hashed;
  } catch (error) {
    console.log(error.message);
  }
};

const comparePassword = async (password, userPass) => {
    try {
        let passMatch = await bcrypt.compare(password, userPass)
        return passMatch
    } catch (error) {
        console.log(error.message);
    }
}

export {securePassword, comparePassword}