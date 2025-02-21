# Project - DevTinder

# Routing
    - handlers
        - get => /user, /user/xyz, /ab?c => abc & ac both works, /ab+c => abc & abbc/abbbbc both works
        - ab*cd => ab asdkfjaks cd => anything inside works
        - a(bc)+d => abcbcbcbcbcd works
        - /a/ => anything which has a inside will work

    - req.query => gives the query params
    - http://localhost:3000/user/:userId/:name/:password
        - req.params => give the above params

# Route Handler
    - one route can have multiple route handlers
        - express doesn't do that directly 
        - it has something called next() for that
        req.use("/user", (req, res, next) => {
            console.log("Route Handler 1");
            next();
            <!-- res.send("Response!!"); -->
        }, (req, res) => {
            console.log("Route Handler 2");
            res.send("Response2!!");
        })

        - next() always expect a next route handler
        