const express = require('express')
const passport = require('passport')
const router =express.Router()

//description - auth with google
//route  GET/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))
    

//description - google auth callback
//route  GET/auth/google/callback

router.get(
    '/google/callback',
     passport.authenticate('google', {failureRedirect: '/'}), 
    (req,res)=>{ //if it fails redirect to the root
    res.redirect('/dashboard') //if it passes, redirect to the dashboard
})

//description - Logout user
//route /auth/logout
router.get('/logout', (req, res,next) =>{
    req.logout((error) =>{
        if(error) {return next(error)}
        res.redirect('/')
    })
    //res.redirect('/') //should the logout the user back to home
}
)

module.exports = router