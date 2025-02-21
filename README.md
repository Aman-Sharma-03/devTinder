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
        
        - either pass them inside the same route or write a different route with handler, like
            - req.use("/user", (req, res, next) => {
                console.log("Handling the route user!!");
                next();
            })
              req.use("/user", (req, res, next) => {
                console.log("Handling the route user!!");
                res.send("2nd Route Handler!!");
              })

        - function that we put in the middle are called middlewares 
        - only the function that returns some response is called route handler

        <!-- GET /users => middleware chain => request handler -->

        - app.use matches the path that starts with that path while app.all will match specifically to that path