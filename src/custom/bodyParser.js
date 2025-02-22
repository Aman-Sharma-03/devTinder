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

module.exports = bodyParser;