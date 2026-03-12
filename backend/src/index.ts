import { Pool } from 'pg'
import * as http from 'node:http'

const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "david",
    password: "test",
    database: "expense tracker"
});


const hostname = "localhost";
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
    return res;
})

server.listen(port, hostname, async () => {
    await pool.connect();
    console.log("test");
})
