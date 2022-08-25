//middleware has access to the request and response
module.exports ={
    ensureAuth: function(req, res, next){ //next is the function you call when you're done doing what you wanna do
        if(req.isAuthenticated()){
            return next() //they are fine and can keep going.
        }else{
            res.redirect('/')
        }
    },
    ensureGuest: function(req, res, next){ //we don't want guests to see the login page.
        if(req.isAuthenticated()){ //if they are authenticated, redirect them to the dashboard.
            res.redirect('/dashboard')
        }
        else{return next()
        }
    },
}