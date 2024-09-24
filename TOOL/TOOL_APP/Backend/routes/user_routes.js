const router = require("express").Router();
const { authenticate } = require("../utilities");
const userControllers = require("../controllers/user_controllers");
const handleLog = require("../middleware/log")

router.get("/", handleLog, userControllers.handleLanding);
router.get("/blockedIps", userControllers.handleBlockedIps);
router.post("/login", userControllers.handleLogin);
router.post("/signup", userControllers.handlSignUp);
router.get("/get-user", authenticate, userControllers.GetUser);

module.exports = router;