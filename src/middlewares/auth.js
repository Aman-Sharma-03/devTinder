const userAuth = (req, res, next) => {
    console.log("Auth is getting checked!");
    const token = 'xyz';
    const isUserAuthorized = token === "xyz";
    if(isUserAuthorized){
        next();
    } else {
        res.status(401).send("Unauthorized request");
    }
}

module.exports = {userAuth}