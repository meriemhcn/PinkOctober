const userModel = require("../dataBase/modles/users.js");
const jwt = require("../util/jwt.js");

async function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  
  if (!token) {
    return res.status(401).json("No token provided");
  }

  try {
    const data = jwt.verifytoken(token);
    
    if (!data) {
      return res.status(401).json("Invalid token");
    }

    const user = await userModel.findOne({ _id: data.id });
    
    if (!user) {
      return res.status(401).json("Invalid token");
    }

    req.user = user; // Stocker l'utilisateur dans req.user pour une utilisation ultérieure
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
}

module.exports = authMiddleware;
