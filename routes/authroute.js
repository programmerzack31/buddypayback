const router = require('express').Router();
const {register,login,getAllUser} = require('../controllers/registrationcontroller');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage })

router.post('/signup', upload.single('profilePic'), register);
router.post('/login',login);
router.get('/allusers',getAllUser);

module.exports = router