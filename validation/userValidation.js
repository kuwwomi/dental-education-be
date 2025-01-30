const Joi = require('joi');


const userCreateSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phone: Joi.string().required(),
})

const createUserSession = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})


const updateUser = Joi.object({
    email: Joi.string().email(),
    phone: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
})

module.exports = {userCreateSchema, createUserSession,updateUser}