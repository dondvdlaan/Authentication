"use strict"
const dbCreate = {
    db: require("./couch.js"),
    dbNames: ["users"],

    create(){
        this.dbNames.forEach(table => {
            this.db.list().then(
                res => {
                    if(res.includes(table)){
                        return true
                    }else{
                        return this.db.create(table)
                    }
                }).then(
                    res => console.log(res)
                ).catch(
                    console.log
                )
        })
    }
}

module.exports = dbCreate; 