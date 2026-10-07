const blockDemo = (req, res, next) => {
    if (req.user && req.user.isDemo) {
        return res.status(403).json({
            message: "This is a read-only demo. Sign up to save your own feedback.",
        });
    }
    next();
};

module.exports = blockDemo;