const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "Not Authorized to access this route",
      });
    }
    next();
  };
};

module.exports = authorize;
