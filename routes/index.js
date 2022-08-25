const express = require('express')
const router =express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth') //..means up a level

const Story = require('../models/Story')
//description - login/landing page
//route  GET/
router.get('/', ensureGuest, (req,res)=>{ //only a guest that is not logged in should be able to see this
    res.render('login', {
        layout: 'login',
    })
    
})

//description - dashboard
//route  GET/dashboard

router.get('/dashboard', ensureAuth,async (req,res)=>{
    try{
        const stories = await Story.find({user:req.user.id}).lean() //inorder to pass in data into an handlebar template and render it, you need to use .lean()
        res.render('dashboard', {
            name:req.user.firstName,
            stories
    })
    }catch(err){
        console.error(err)
        res.render('error/500')
    }

   
    })

module.exports = router