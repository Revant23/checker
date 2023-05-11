const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(4001, () => {
            console.log("Server Running at http://localhost:4001/");
        });
    } catch (e) {
        console.log(`DB Error ${e.message}`);
        process.exit(1);
    }
};

initializeDBAndServer();

//API(POST)

app.post("/todos/", async (request, response) => {
    const TodoDetails = request.body;
    const { id, todo, priority, status } = TodoDetails;
    const addTodoQuery = `
    INSERT INTO 
    todo(id,todo,priority,status)
    VALUES
    (
        '${id}',
        '${todo}',
        '${priority}',
        '${status}'
    );`;
    const DbResponse = await db.run(addTodoQuery);
    response.send("Todo Added");
});

//API(GET)
app.get("/todos/", async (request, response) => {
    const getTodoQuery = `
    SELECT
    *
    FROM
    todo;`;
    const Todos = await db.all(getTodoQuery);
    response.send(Todos);
});

//API 1
app.get("/todos/", async (request, response) => {
    const statusCheck = request.query;

    const getTodoQuery = `
    SELECT
    *
    FROM
    todo
    WHERE
    status = '${statusCheck}';`;
    const Todo = await db.get(getTodoQuery);
    response.send(Todo);
});
