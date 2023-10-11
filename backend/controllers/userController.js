const User = require('../models/user')
const jwt = require('jsonwebtoken')

const createWebToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET_KEY, {expiresIn: '1d'})
}

const register = async (req, res) => {
  try {
    const {name,userName, email, password, phone, addresses, role} = req.body
    if (!name) {
      throw new Error('name required')
    }
    const user = await User.create({name,userName, email, password, phone, addresses, role})
    // if (user) {
    //   const token = createWebToken(user._id)
    //   res.cookie('jwt',token, {httpOnley: true, maxAge: 86400 * 1000})
    //   res.status(200).json({name: user.name, email:user.email, role:user.role})
    // } else {
    //   res.status(500).json({error: 'Failed to create user'})
    // }
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}
const requests = async (req, res) => {
  try {
    const {name,userName, email, password, phone, addresses, role} = req.body
    if (!name) {
      throw new Error('name required')
    }
    const user = await User.create({name,userName, email, password, phone, addresses, role})
    // if (user) {
    //   const token = createWebToken(user._id)
    //   res.cookie('jwt',token, {httpOnley: true, maxAge: 86400 * 1000})
    //   res.status(200).json({name: user.name, email:user.email, role:user.role})
    // } else {
    //   res.status(500).json({error: 'Failed to create user'})
    // }
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}
const login = async (req, res) => {
  try {
    const {userName, password} = req.body
    const user = await User.findOne({userName})
    if (user && user.password === password) {
      const token = createWebToken(user._id)
      res.cookie('jwt',token, {httpOnley: true, maxAge: 86400 * 1000})
      res.status(200).json({name: user.name, email:user.email, role:user.role})
    }
    if (user) {
      const token = createWebToken(user._id)
      res.cookie('jwt',token, {httpOnley: true, maxAge: 86400 * 1000})
      res.status(200).json({name: user.name, email:user.email, role:user.role})
    } else {
      res.status(500).json({error: 'Failed to create user'})
    }
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}
const getData = async (req, res) => {
  try {
    const user = req.user
    if (user) {
      res.status(200).json({name: user.name, email:user.email, role:user.role})
    } else {
      res.status(500).json({error: 'Failed to get user'})
    }
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}
const logout = async (req, res) => {
  try {
    res.cookie('jwt','', {httpOnley: true, maxAge: 86400 * 1000})
    
      res.status(200).json({message:'Logged out successfully'})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}



module.exports = {
  register,
  login,
  getData,
  logout
}