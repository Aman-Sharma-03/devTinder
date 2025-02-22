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

# Error handling
    - error handling can be performed using app.use also
    - app.use("/", (err, req, res, next) => {});
    
# Database Connection
    - mongoose.connect(uri)
    - First the database connection should be made and after that server should start listening

# Schema Design
    - What all you will be storing in the database
    - mongoose.Schema(object)
    - this object contains the definition {firstName: {type: String},...}

    - mongoose.model("alias", schema);
    - model is like a class, we create new instances of class when new user comes

# Creating my own Body Parser
    - express provides body parser middleware
        - express.json()
        - bodyParser.json()

    - My own bodyparser
    const bodyParser = async (req, res, next) => {
        let body = []
        // because the request body might be sent in multiple chunks so we await for each chunk
        for await(const chunk of req){
            body.push(chunk);
        }
        body = Buffer.concat(body).toString('utf-8');
        req.body = body;
        if(req.headers['content-type'] === 'application/json'){
            req.body =  JSON.parse(body);
            const params = new URLSearchParams("name=Aman&age=10");
            const queries = params.entries();
            console.log(queries);
        } else if(req.headers['content-type'] === 'application/x-www-form-urlencoded') {
            // URLSearchParams is an object to parse, manipulate, and serialize query strings
            let params = new URLSearchParams(body);
            // .entries is an iterator for the params we have recieved
            let queries = params.entries();
            // fromEntries transforms a list of key-value pairs into an object
            req.body = Object.fromEntries(queries);
        }
        next();
    }