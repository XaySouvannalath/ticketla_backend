const JWT_SECRET_KEY = "b1zg1tal";
const jwt = require("jsonwebtoken");

module.exports = {
  authMiddleware: async (req, res, next) => {
    // Get the token from the Authorization header

    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(" ")[1];
    // console.log(token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET_KEY);
      console.log(decoded)
      console.log(req.user)
      req.user = decoded;
      next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({ message: "Invalid token" });
    }
  },
  staffMiddleWare: async (req, res, next) => {
    // Get the token from the Authorization header

    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(" ")[1];
    // console.log(token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET_KEY);
      if(decoded.username){

        req.user = decoded;
        next();
      }else{
      return res.status(403).json({ message: "Invalid token" });

      }
    } catch (error) {
      console.log(error);
      return res.status(403).json({ message: "Invalid token" });
    }
  },
};
