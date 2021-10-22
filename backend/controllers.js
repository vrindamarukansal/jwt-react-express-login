const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10

exports.login = async (req,res)=>{
    try{
        const { name, password } = req.body
        if(name && password)
        {
            const { username, passwordHash, userId, privateKey } = process.env
            let match  = await bcrypt.compare(password,passwordHash)
            if(name===username && match)
            {
                console.log('now we sign')
                const token = await jwt.sign(
                    { userId:userId }, 
                    privateKey,
                    { expiresIn: '1h'}
                )
                if(token) return res.json(token)
            }
        }
        return res.sendStatus(401)        
    } catch(err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

exports.verifyToken = (req,res, next)=>{
    try{
        req.user = {userId:null, verified:false}
        const { privateKey } = process.env
        const bearerHeader = req.headers['authorization']
        if(typeof bearerHeader!=='undefined')
        {
            const bearerToken = bearerHeader.split(' ')[1]
            jwt.verify(bearerToken, privateKey, function (err,data){
                if(! (err && typeof data=== 'undefined'))
                    req.user = {userId:data.userId, verified:true}
            })
        }
        next()
    }catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
}

exports.updatePassword = async(req,res)=> {
   try{
       if(req.user.verified){
            const { oldPassword, newPassword } = req.body
            const { passwordHash } = process.env

            if(oldPassword && newPassword)
            {
                let match = await bcrypt.compare(oldPassword, passwordHash)
                if(match) 
                {
                    let hash = await bcrypt.hash(newPassword, saltRounds)
                    if (hash) return res.json(hash)
                }
            }
        }
        return res.sendStatus(401)

    } catch(err){
        console.log(err)
        return res.sendStatus(500)
    }
}