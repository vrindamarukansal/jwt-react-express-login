const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10

exports.login = async (req,res)=>{
    try{
        const { name, password } = req.body
        if(name && password)
        {
            const { username, passwordHash, privateKey } = process.env
            let match  = await bcrypt.compare(password,passwordHash)
            if(name===username && match)
            {
                const token = await jwt.sign(
                    { username:username }, 
                    privateKey,
                    { expiresIn: '1h'}
                )
                if(token) {
                    return res.json({token:token, username:username})
                }
            }
        }
        return res.sendStatus(401)        
    } catch(err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

exports.verifyToken = (req,res, next)=>{
    req.user = {username:null, verified:false}
    const { privateKey } = process.env
    const bearerHeader = req.headers['authorization']
    if(typeof bearerHeader!=='undefined')
    {
        const bearerToken = bearerHeader.split(' ')[1]
        jwt.verify(bearerToken, privateKey, function (err,data){
            if(! (err && typeof data=== 'undefined'))
                {
                    req.user = {username:data.username, verified:true}
                    next()
                }
            else {
                console.log(err.name)
                return res.sendStatus(403)
            }
        })
    }
}

exports.updatePassword = async(req,res)=> {
   try{
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
        return res.sendStatus(401)
    } catch(err){
        console.log(err)
        return res.sendStatus(500)
    }
}

exports.logout = (req,res) => {
    const bearerHeader = req.headers['authorization']
    if(typeof bearerHeader!=='undefined'){
        const bearerToken = bearerHeader.split(' ')[1]
        //add bearerToken to blacklist
    }
    return res.sendStatus(200)
}