const router = require("express").Router();
const { userCreateSchema } = require("../validation/userValidation");
const userHandler = require("../handler/userHandler");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname).toLowerCase(); // Get original file extension
    cb(null, `${uniqueSuffix}${extension}`);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 2MB file size limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

router.post("/", userHandler.register);
router.post("/login", userHandler.login);
router.get("/me", authMiddleware, userHandler.getProfile);
router.put("/", authMiddleware, userHandler.updateProfile);
router.put(
  "/photo",
  upload.single("file"),
  authMiddleware,
  userHandler.updatePhotoProfile
);
router.post("/forgot-password", userHandler.forgotPassword);
router.post("/verify-password", userHandler.verifyPassword);

module.exports = router;
