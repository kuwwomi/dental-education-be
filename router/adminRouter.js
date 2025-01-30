const router = require("express").Router();
const adminHandler = require("../handler/adminHandler");
router.post("/", adminHandler.inviteAdmin);
router.post("/login", adminHandler.login);
router.post("/verify", adminHandler.registerAdmin);
module.exports = router;
