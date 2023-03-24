export default class UserDTO {

    constructor(user) {
        this.id = user.id || user._id || null

        thisa.first_name = user.first_name
        thisa.last_name = user.last_name
        thisa.email = user.email
        thisa.age = user.age
        thisa.password = user.password
        thisa.role = user.role
    }

}