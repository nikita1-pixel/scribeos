const expres = require("express");
const router = expres.Router(); 
const { registerUser, loginUser, getMe } = require("../controllers/auth.controller");
const protect = require("../middleware/auth.middleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

module.exports = router;    