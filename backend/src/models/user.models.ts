import { PrismaClient} from '@prisma/client'
import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import uuid  from "uuid"

const prisma = new PrismaClient()

// get all users
const getAllUsers = async() =>{
    return await prisma.user.findMany()
}

// add user
const addUser = async(data: User)=>{
    return await prisma.user.create({data}) // add an user
}

// get user by id
const getUserById = async(id: string)=>{
    return await prisma.user.findUnique({
        where: {id}
    })
}

// update user
const updateUser = async (id: string, data: Partial<User>)=>{
    const userFound = await getUserById(id)
    if(!userFound){
        return null
    }
    return await prisma.user.update({
        where: {id},
        data
    })
}

//delete user
const deleteUser = async(id: string)=>{
    const userFound = await getUserById(id)
    if(!userFound){
        return null
    }
    return prisma.user.delete({
        where: {id}
    })
}


export default{
    getAllUsers,
    addUser,
    getUserById,
    updateUser,
    deleteUser
}



