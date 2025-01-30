const router = require("express").Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const predictionHandler = require("../handler/predictionHandler");
const authMiddleware = require("../middleware/authMiddleware");
router.get("/analytics",authMiddleware, predictionHandler.ListAnalytics);
router.get("/admin/predictions", predictionHandler.ListAdminPredictions);
router.get("/", authMiddleware, predictionHandler.ListUserPredictions);
router.post("/", authMiddleware, predictionHandler.insertPrediction);
router.post(
  "/bulk/anatomy",
  upload.single("file"),
  authMiddleware,
  predictionHandler.bulkPrediction
);

router.delete("/admin", authMiddleware, predictionHandler.deletePrediction);

module.exports = router;
