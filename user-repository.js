import DBLocal from 'db-local'

import crypto from 'node:crypto'
import bcrypt from 'bcrypt'

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

        console.log(`SERVER: New user created \n ID: ${id} \n Username: ${username} \n Password: ${hasedPassword} \n`)

        return id
    }


    static login({ username, password }) { 
        Validation.username(username)
        Validation.password(password)

        const user = User.findOne({username})
        if (!user)throw new Error('username does not exist')

        const isValid = bcrypt.compareSync(password, user.password)
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