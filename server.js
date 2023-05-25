// import the express library
const express = require("express");
const fs = require("fs");
const PORT = 3030;

// create an instance of express
const app = express();

//midware
app.use(express.json());


// sendind a welcome message
app.get( '/', (req, res) => {
    res.status( 200 ).json ( {
         message: "welcome to my new service"
    })
    // res.send("welcome")
})

// Read Database
const readDatabase = (req, res) => {
    const database = fs.readFileSync('./user.json')
    return JSON.parse(database);
}

// Write to database
const writeDatabase = (data) => {
    fs.writeFileSync('./user.json', JSON.stringify(data, null, 2))
}

// GET all users in the database
app.get("/users", (req, res) => {
    const users = readDatabase()
    if(users.users.length === 0) {
        res.status(404).json({
            message: "No users found"
        })
    } else {
        res.status(200).json({
            message: "OK",
            data: users,
            total: users.users.length
        })
        // res.send(users);
    }
})


// Get one user
app.get('/users/:id', (req, res) => {
    const database = readDatabase()
    const userid = parseInt(req.params.id);
    const users = database.users.find(user => user.id === userid)
    if(users === 0) {
        res.status(404).json({
            message: "User not found"
        })
    } else {
        res.status(200).json({
            message: "success",
            data: users
        })
    }
})


// Creating a new user
app.post('/users', (req, res) => {
    const database = readDatabase();
    const newUser = req.body;
    newUser.id = database.users.length + 1;
    database.users.push(newUser);
    writeDatabase(database);
    res.status(201).json({
        newData: newUser
    })

    // second method
    // const { name, age } = req.body;
    // newUserid = database.users.length + 1;
    // newUser = {
    //     id: newUserid,
    //     name,
    //     age
    // }

    // database.users.push(newUser);
    // writedatabase(database);
    // res.status(201).json({
    //     newData: newUser
    // })
})


app.patch('/users/:id', (req, res)=>{
    const database = readDatabase();
    const userid = parseInt(req.params.id);
    const updatedUser = req.body
    const index = database.users.findIndex((i)=>(i.id === userid));
    if(index !== -1) {
        database.users[index] = {...database.users[index], ...updatedUser}
        writeDatabase(database)
        res.status(200).json({
            data: database.users[index]
        });
    } else {
        res.status(404).json("Wrong id sent");
    }
})


//delete a user
app.delete('/users/:id', (req, res) => {
    const database = readDatabase();
    const userid = parseInt(req.params.id);
    const index = database.users.findIndex((i)=>(i.id === userid))
    if (!database.users[0] || !index) {
        res.status(404).json({
            message: `This id: ${userid} does not exit`
        })
    } else {
        deletedUser = database.users[index]
        database.users.splice(index, 1);
        writeDatabase(database);
        res.status(200).json({
            deleteData: deletedUser
        });
    }
})


// set the port
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
});
