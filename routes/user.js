const router = require("express").Router();
const auth = require("../middelware/auth");
const upload = require("../utils/multer"); // multer config
const {
  getCurrentUser,
  updateProfilePic,
  updateUserProfile,
  getAllUsers
} = require("../controllers/user");

router.get("/me", auth, getCurrentUser);
router.get("/users",auth,getAllUsers);
router.put("/updatepic", auth, upload.single("profilePic"), updateProfilePic);
router.put("/update", auth, upload.single("profilePic"), updateUserProfile);

module.exports = router;
