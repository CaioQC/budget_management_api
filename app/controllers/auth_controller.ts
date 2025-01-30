import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
    async login({response, request, auth}:HttpContext){
        try{
            const { email, password } = request.only(["email", "password"]) 
            
            const user = await User.verifyCredentials(email, password)
    
            await auth.use("web").login(user)
    
            return response.status(200).json({ message : `${user.fullName} successfully loged in` })
        }

        catch(error){
            return response.status(400).json({ error : error.message })
        }
    }

    async logout({auth, response}:HttpContext){
        try{
            const user = auth.user
    
            await auth.use("web").logout()
    
            response.status(200).json({ message : `${user?.fullName} successfully loged out` })
        }

        catch(error){
            return response.status(500).json({ error : error.message })
        }
    }
}