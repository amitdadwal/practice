const  userIds= new Map();

const setUser = (uuid, user)=>{
    userIds.set(uuid, user);
}

const getUser =(uuid)=>{
    return userIds.get(uuid);
}

module.exports={
    setUser,
    getUser
}