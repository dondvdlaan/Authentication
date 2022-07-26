'use strict';
const findUser = {
    db      : require("./couch.js"),
    dbName  : "users",
    findUser(requestedMail){
        this.db.use(this.dbName).find({
            selector: {
                email : requestedMail
            }
        }).then(
            res => res.docs
        ).then(
            res => console.log(res)
        ).catch(
            console.log
        )
    },
    async doesExist(requestedMail,requestedUsername){
        //1 email
        //2 Username
        let existingAccounts = 0
        let error = []
        await this.db.use(this.dbName).find({
            selector: {
                email : requestedMail
            }
        }).then(
            res => res.docs
        ).then(
            res => {
                if(!res.length<1)error.push(1)

                existingAccounts += res.length
            }
        ).catch(
            console.log
        )
        // await this.db.use(this.dbName).find({
        //     selector: {
        //         username : requestedUsername
        //     }
        // }).then(
        //     res => res.docs
        // ).then(
        //     res => {
        //         if(!res.length<1)error.push(2)

        //         existingAccounts += res.length
        //     }
        // ).catch(
        //     console.log
        // )
        return { 
            accountExist: (existingAccounts<1),
            errorType: error
        }
    },
    async findUserForLogin(requestedEmail){
        return await this.db.use(this.dbName).find({
            selector: {
                email : requestedEmail
            }
        }).then(
            res => res.docs
        ).then(
            res => {
                return res;
            }
        ).catch(
            console.log
        )
    
    }
}
module.exports = findUser; 