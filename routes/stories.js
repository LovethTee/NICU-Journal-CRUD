const express = require('express')
const res = require('express/lib/response')
const router =express.Router()
const {ensureAuth} = require('../middleware/auth') //..means up a level

const Story = require('../models/Story')

//description - Show add page
//route  GET/stories/add
router.get('/add', ensureAuth, (req,res)=>{ //only a guest that is not logged in should be able to see this
    res.render('stories/add')
        
    })

//description - Process the add form
//route  POST/stories/
router.post('/', ensureAuth, async (req,res)=>{ 
    try{
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    }catch (err){
        console.error(err)
        res.render('error/500')
    }
        
    })

//description - SHOW ALL PUBLIC STORIES
//route GET/stories
router.get('/', ensureAuth, async(req, res) =>{
    try{
        const stories = await Story.find({status:'public'})
        .populate('user')
        .sort({createdAt: 'desc'}) //descending order
        .lean()
        res.render('stories/index',{
            stories
        })
    }catch(err){
        console.error(err)
        res.render('error/500')
    }
}
)

//description - SHOW SINGLE STORY (To get the read more)
//route  GET/stories/:id
router.get('/:id', ensureAuth, async (req,res)=>{ 
    try{
        let story = await Story.findById(req.params.id)
            .populate('user')
            .lean()

            if(!story){
                return res.render('error/404')
            }
        res.render('stories/show', {
            story
        })
    }catch(err){
        console.error(err)
        res.render ('error/404')}
    }
        
    
)
//description - SHOW EDIT PAGE
//route  GET/stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
      const story = await Story.findOne({
        _id: req.params.id,
      }).lean()
  
      if (!story) {
        return res.render('error/404')
      }
  
      if (story.user != req.user.id) {
        res.redirect('/stories')
      } else {
        res.render('stories/edit', {
          story,
        })
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  })

//description - UPDATE story
//route  PUT/stories/:id
router.put('/:id', ensureAuth, async (req,res)=>{ 
   let story = await Story.findById(req.params.id).lean()

   if(!story){
       return res.render('error/404')
   }
       
   if (story.user != req.user.id) {
    res.redirect('/stories')
  } else {
    story = await Story.findOneAndUpdate({_id: req.params.id}, req.body,{
        new:true,
        runValidators: true
    })

    res.redirect('/dashboard')
    }
} )

//description - DELETE story
// route - DELETE/stories/:id

    router.delete('/:id', ensureAuth, async (req,res)=>{ 
        try {
            await Story.remove({_id:req.params.id})
            res.redirect('/dashboard')
        } catch (err) {
            console.error(err)
            return res.render('error/500')
            
        }
            
    })
//description - USER STORIES
//route  GET/stories/user/:userId
router.get('/user/:userId', ensureAuth, async(req,res)=>{ //only a guest that is not logged in should be able to see this
   try {
       const stories = await Story.find({
           user: req.params.userId,
           status:'public'
       })
       .populate('user')
       .lean()

       res.render('stories/index', {
           stories
       })
   } catch (err) {
       console.error(err)
       res.render('error/500')
   }
        
    })
    
    



module.exports = router