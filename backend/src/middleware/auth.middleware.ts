import { Request, Response, NextFunction } from "express";


// Error response structure
interface ErrorResponse {
    success: boolean;
    message: string;
    statusCode: number;
}

// Auth userlogged in 
export const auth = (req: Request, res: Response, next: NextFunction)=>{

    if(!req.session){
        const error: ErrorResponse = {
            success: false,
            message: "Sesion does not exist",
            statusCode: 403
        }
        res.json(error)
        return 
    }

    const {isLogedIn} = req.session.isLogedIn

    if(!isLogedIn){
        const error: ErrorResponse = {
            success: false,
            message: "User is not loggedin",
            statusCode: 400
        }
        res.json(error)
        return 
    }

    next()
}

// auth user logged out
export const isLoggedOut = (req: Request, res: Response, next: NextFunction) =>{
    if(!req.session){
        const error: ErrorResponse = {
            success: false,
            message: "Session does not exist",
            statusCode: 403
        }
        res.json(error)
        return
    }
    const {isLogedIn} = req.session.isLogedIn
    if(isLogedIn){
        res.status(403).json({message: "User is logged In"})
        return
    }
    next()
}