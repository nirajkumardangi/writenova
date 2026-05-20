import { getUserById } from "./user.service.js";

export async function getProfile(req, res, next) {
  try {
    const user = await getUserById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
}
