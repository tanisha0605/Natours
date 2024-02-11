const express=require('express');

const userController=require('./../controllers/userController')
const authenticationController=require('../controllers/authController')


const router=express.Router();

router.post('/signup',authenticationController.signup)
router.post('/login',authenticationController.login)
router.post('/logout',authenticationController.logout)
router.post('/forgotPassword',authenticationController.forgotPassword)
router.patch('/resetPassword/:token',authenticationController.resetPassword)


router.use(authenticationController.protect) //All routes after this middleware will be protected
router
    .patch('/updateMyPassword',
    authenticationController.updatePassword
    )
router
    .get('/me',
    userController.getMe,
    userController.getUser
    )
router
    .patch('/updateMe',
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
    )
router
    .delete('/deleteMe',
    userController.deleteMe
    )
router.use(authenticationController.restrictTo('admin'))
router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser)

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

module.exports=router;