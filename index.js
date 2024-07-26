import express from "express";

import { PORT } from "./config.js";
import { UserRepository } from "./user-repository.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("SERVER: operating correctly on the following port");
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await UserRepository.login({ username, password })
        res.send({ user })
    } catch (error) {
        console.log(
            `SERVER: Error when trying to login into an acount, with the following data \n Username: ${username} \n Password: ***** \n ESTATUS: (401) ${error.message} \n`
        );
        res.status(401).send(error.message);
    }
});

app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const id = await UserRepository.create({ username, password });
        res.send({ id });
    } catch (error) {
        console.log(
            `SERVER: Error when trying to create a new User, with the following data \n Username: ${username} \n Password: ***** \n ESTATUS: (400) ${error.message} \n`
        );
        res.status(400).send(error.message);
    }
});

app.post("/logout", (req, res) => { });

app.get("/protected", (req, res) => { });

app.listen(PORT, () => {
    console.log(
        `SERVER: operating correctly on the following port \n \n service rute:  http://localhost:${PORT} \n`
    );
});
