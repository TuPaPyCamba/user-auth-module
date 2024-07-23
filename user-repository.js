import DBLocal from 'db-local'
import Schema from 'db-local/lib/modules/schema'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
    _id: { type: String, require: true },
    username: { type: String, require: true },
    password: { type: String, require: true }
})
export class UserRepository {
    static create({ username, password }) {

        if (typeof username !== 'string') throw new Error('username must be a string')
        if (typeof username.length < 5) throw new Error('username must be at least 5 characters long')

        if (typeof password !== 'string') throw new Error('password must be a string')
        if (typeof password.length < 8) throw new Error('password must be at least 8 characters long')
        
        const user = User.findOne({ username })
        if (user) throw new Error('username already exists')

        const id = crypto.randomUUID()

        User.create({
            _id: id,
            username,
            password
        }).save()

        return id
    }


    static login({ username, password }) { }
}