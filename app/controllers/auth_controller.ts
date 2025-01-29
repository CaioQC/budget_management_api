import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
    async login({response, request, auth}:HttpContext){
        const { email, password } = request.only(["email", "password"]) 
        
        const user = await User.verifyCredentials(email, password)

        await auth.use("web").login(user)

        return response.status(200).json({ message : `${user.fullName} successfully loged in` })
    }

    async logout({auth, response}:HttpContext){
        const user = auth.user

        await auth.use("web").logout()

        response.status(200).json({ message : `${user?.fullName} successfully loged out` })
    }
}