import express, {Request, Response} from "express";
import dotenv from "dotenv"
import cors from "cors"
import cookieSession from "cookie-session"
import userRouter from "./routes/user.routes";
import { error } from "console";

dotenv.config() // initialize dotenv

// create a new express instance
const app = express()

// middleware
app.use(cors({
    credentials: true
})) // frontend and backend communication
app.use(express.json())// alows json post

// cookie keys
const cookie_s = process.env.COOKIE_S
const cookie_e = process.env.COOKIE_E

// Close the server if the cookies do not exist
if(!cookie_e || !cookie_s){
    throw error("Cookie keys are missing")
}


// cookies-session
app.use(cookieSession({
    name: "session",
    maxAge: 7 * 24 * 60 * 60 * 1000,  // one week of duration
    keys: [
        cookie_s,
        cookie_e
    ]
}))

// Routes
app.use("/user",userRouter)
// Fallback
app.use((req: Request, res: Response)=>{
    res.status(404).json({message: "Inexistent Route"})
})

// start the server
const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server is running in ${PORT}`)
})



