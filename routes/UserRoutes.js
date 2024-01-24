const express= require('express')
const userController = require('../controller/userController');
const { upload } = require('../middleware/multer/uploadImage');
const { requireSignIn } = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/register',  userController.register);
//login
router.post('/login',userController.login)
router.post('/logout' , (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
  });
router.post('/adduser', requireSignIn, upload.single('photo'),userController.createUser);
router.get('/adduser',requireSignIn,userController.getcreateUser);
router.delete('/adduser/:id',requireSignIn,userController.deleteUser);
router.put('/adduser/:id',requireSignIn, upload.single('photo'),userController.updateUser);

module.exports= router
