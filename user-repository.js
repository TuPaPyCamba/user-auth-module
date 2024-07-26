import DBLocal from 'db-local'
import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import 'colors'

import { SALT_ROUNDS } from './config.js'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
    _id: { type: String, require: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
})
export class UserRepository {
    static create({ username, password }) {

        Validation.username(username)
        Validation.password(password)

        const user = User.findOne({ username })
        if (user) throw new Error('username already exists')

        const id = crypto.randomUUID()
        const hasedPassword = bcrypt.hashSync(password, SALT_ROUNDS)

        User.create({
            _id: id,
            username,
            password: hasedPassword,
        }).save()

        console.log(`SERVER:`.green + ` New user created \n ID: ${id} \n Username: ${username} \n Password: ${hasedPassword} \n`)

        return id
    }


    static async login({ username, password }) { 
        Validation.username(username)
        Validation.password(password)

        const user = User.findOne({username})
        if (!user)throw new Error('username does not exist')

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) throw new Error('password is invalid')

        console.log(`SERVER:`.green + ` A new session has been started, the session started is \n Username: ${username} \n`)

        return user
    }

}

class Validation {
    static username(username) {
        if (typeof username !== 'string') throw new Error('username must be a string')
        if (username.length < 5) throw new Error('username must be at least 5 characters long')
    }

    static password(password) {
        if (typeof password !== 'string') throw new Error('password must be a string')
        if (password.length < 8) throw new Error('password must be at least 8 characters long')
    }
}