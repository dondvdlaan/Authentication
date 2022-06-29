'use strict';
const getUserData = {
    db: require("./couch.js"),
    dbName: "users",
    getUser(id,rev){
        return this.db.use(this.dbName).find({
            selector: {
                _id : id,
                _rev : rev,
            }
        }).then(
            res => res.docs
        ).then(
            res => res[0]
        ).catch(
            console.log
        )
    },

}
module.exports = getUserData; 