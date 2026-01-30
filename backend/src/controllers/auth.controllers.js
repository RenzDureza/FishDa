import * as authService from "../services/auth.services.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userID = await authService.register({
      username, 
      email,
      password
    });

    res.status(201).json({
      message: "User Created",
      id: userID
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
