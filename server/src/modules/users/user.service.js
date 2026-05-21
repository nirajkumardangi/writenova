import User from "./user.model.js";

export async function getUserById(id) {
  return User.findById(id).select("-password");
}