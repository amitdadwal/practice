const http = require('http');
const server = http.createServer((req, res)=>{
    console.log("URL: ",req.url);
    console.log("Method:", req.method);

    res.setHeader('Content-Type', 'text/plain');

    if( req.method === "GET" && req.url==="/"){
        res.statusCode = 200;
        res.end("Welcome to the Home Page");
        return;
    }

    if( req.method === "GET" && req.url==="/about"){
        res.statusCode = 200;
        res.end("Welcome to the About Page");
        return;
    }

    if( req.method === "GET" && req.url==="/users"){

        const users = [
            {id: 1, name: "John Doe"},
            {id: 2, name: "Jane Doe"},
            {id: 3, name: "Jim Doe"}
        ]
        res.statusCode = 200;
        res.end(JSON.stringify(users));
        return;
    }

    if(req.method === "POST" && req.url === "/users"){
        let body = '';

        req.on('data', (chunk)=>{
            body += chunk;
        })

        req.on('end', ()=>{
            const user = JSON.parse(body);
            res.statusCode = 201;
            res.end(JSON.stringify({
                message:"User created successfully",
                user: user
            }))
        });  
        return;
    }
    if(req.method === "DELETE" && req.url === "/users"){
        res.statusCode = 200;
        res.end("User deleted successfully");
        return;
    }
    res.statusCode = 404;
    res.end('Not found');
})

server.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})