const jwt = require("jsonwebtoken");
const isAuthenticated = (req, res, next) => {
  try {
    // geting token from body
    const { authorization } = req.headers;
    // verify check token get or not
    if (!authorization)
      return res
        .status(401)
        .send({ success: false, message: "Unotherize access please sign in" });

    // getting decoded token
    const decoded = jwt.verify(authorization, process.env.JWT_SECREAT_KEY);

    // adding decoded token into req.user
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
    res.status(404).send({
      success: false,
      message: "Error while authnticate",
      error: error.message,
    });
  }
};

module.exports = { isAuthenticated };
