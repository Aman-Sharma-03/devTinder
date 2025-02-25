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

# Mongoose functions
    - To create - user.save();
    - To get - User.find({}), User.findOne({})
    - To delete - User.findByIdAndDelete(id)
        - findByIdAndDelete is shorthand for findOneAndDelete({_id: id})

# Data Sanitization & Schema Validation
    - In POST & PATCH api we are posting and updating data
    - We need to only insert validated and sanitized data
    - We can't insert anything we receive

    - We can add strict checks inside the schema model
        - mandatory required fields (required: true) - refer models/user.js
    
    - Custom Validation function in mongoose Schema
        validate(value) {
            if(["male", "female", "Other"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }

    - validations won't run when we patch data, they only run when the new User is created

    - We can pass the runValidators options as true in the patch mongoose call to validate

## API Level Validation (Data Sanitization)
    - We user is signing in we don't need all the fields we just need few, like firstname, lastname, emailid, password
    
    - EmailId changes are not allowed
    - NEVER TRUST USER DATA - YOU SHOULD ALWAYS ADD VALIDATION TO EACH AND EVERY FIELD, SPECIALLY IN PUT & PATCH

    - Library - validator.js (npm)
    

# Password Encryption
    - npm bcrypt

    - Hashing
        Password and salt are taken and multiple round of encryption is done to encrypt the password

# Authentication, JWT & Cookies
    - on login email and password is validated and then a jwt cookie is sent to the client
    - now whenever user asks for something that needs authentication, this jwt cookie is sent along with the request and then on the server end it is revalidated
    
    - If the cookie has expired then the revalidation fails, user needs to authenticate again

    ## JWT:
        - JWT token is divided into 3 parts, header, payload and signature
        - data can be hide in payload of JWT

        jsonwebtoken is the library to generate a jwt token
        - To generate: jwt.sign({data to hide}, "SECRET", {exiresIn: '7d'})
            we generally hide the userid inside the jwt payload to verify the user

# Mongoose Schema Methods
    - Coupling the closely related things together
    - We can define the methods in the Schema itself
    - Helps offload the major tasks


# Express Router
    - Helps to group up routes together

    const authRouter = express.Router();

    authRouter.post("/", (req, res) => {})

    module.exports = authRouter;

# Mongoose Schema pre
    - it is kinda middleware
    - can be used to put validations
    - there are some comparison functions too


# Indexes in Mongo
    - makes the search faster (sorts the data in particular fashion)
    - we will be finding user by emailId a lot so we can make it as a index in user schema
    
    - MongoDB automatically creates index on unique fields
    emailId: {
        type: String,
        required: true,
        index: true,
    } 

    - Compound Index => putting index on more than 1 field
    connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })
    1 => ascending order
    -1 => descending order

# Though Process - POST vs GET
    - POST - user sends some data, massage it and save it
    - GET - user asks for some info, get it from db massage it and send it back

# Building Relation Between Schemas
    - provide a ref to the schema
    - then after that we can populate the current schema with the reference schema

    - it is like joins in SQL

# Pagination
    - /feed?page=1&limit=10 => 1-10 => .skip(0) & .limit(10) 
    - /feed?page=2&limit=10 => 11-20 => .skip(10) & .limit(10)
    - /feed?page=3&limit=10 => 21-30 => .skip(20) & .limit(10)

    - .skip(0) .limit(10)
    - .skip((page-1)*limit).limit(limit);