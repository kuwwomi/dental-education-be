const router = require("express").Router();
const adminHandler = require("../handler/adminHandler");
router.post("/", adminHandler.inviteAdmin);
router.post("/login", adminHandler.login);
router.post("/verify", adminHandler.registerAdmin);
router.post("/forgot-password", adminHandler.forgotPasswordAdmin);
router.post("/verify-password", adminHandler.verifyPassword);
module.exports = router;
