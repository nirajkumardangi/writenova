import User from "../users/user.model.js";

export async function findOrCreateUser(email, defaults = {}) {
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, ...defaults });
  }
  return user;
}
