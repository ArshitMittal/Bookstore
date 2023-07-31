const express = require('express')
const User = require('../models/user')
const { authMiddleware, authAdmin } = require('../middleware/auth')
const router = new express.Router()
const controllerUser = require('../controllers/user')

<<<<<<< HEAD

//Register api endppoint is created for registering new users 
router.post('/register', async (req, res) => {
   
    const { error, value } = User.prototype.validateUserData(req.body); // will validate user req body using joi 
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const user = new User(value)  // will create new user 
    try {
        await user.save() // will save data to the database 
        const token = await user.generateAuthToken() //will generate token for authenticating users 
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})


//user that have already registered can use this path to login 
router.post('/users/login', async (req, res) => {
    // console.log(req.body)
    const { error, value } = User.prototype.validateUserDataLogin(req.body); // will validate user req body using joi 
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const user = await User.findByCredentials(req.body.name ,req.body.email, req.body.password) // will check the user credentials
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e.message)
    }
})
=======
router.post('/register', controllerUser.registerUser) 
router.post('/users/login', controllerUser.loginUser)
>>>>>>> 884069d (Log Files added)


// Following functionalities are not required by the project 
// router.post('/users/logout', authMiddleware, async (req, res) => {
//     try {
//         req.user.tokens = req.user.tokens.filter((token) => {
//             return token.token !== req.token
//         })
//         await req.user.save()

//         res.send()
//     } catch (e) {
//         res.status(500).send()
//     }
// })

// router.post('/users/logoutAll', authMiddleware, async (req, res) => {
//     try {
//         req.user.tokens = []
//         await req.user.save()
//         res.send()
//     } catch (e) {
//         res.status(500).send()
//     }
// })

// router.get('/users/me', authMiddleware,authAdmin, async (req, res) => {
//     res.send(req.user)
// })

// router.patch('/users/me', authMiddleware, async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }

//     try {
//         updates.forEach((update) => req.user[update] = req.body[update])
//         await req.user.save()
//         res.send(req.user)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

// router.delete('/users/me', authMiddleware ,authAdmin, async (req, res) => {
//     try {
//         await req.user.remove()
//         res.send(req.user)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

module.exports = router
