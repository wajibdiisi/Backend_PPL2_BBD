const jwt = require("jsonwebtoken");

const key = require('../config/key').secret;


const verifyToken = (req, res, next) => {
  /*const token =
    req.body.token || req.query.token || req.headers["x-access-token"] || req.headers['authorization'];
  */
    const token = req.headers.authorization.split(' ')[1]; 
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, key);
    req.userID = decoded._id;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;