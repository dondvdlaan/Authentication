"use strict"
const dbInsert = {
    db: require("./couch.js"),
    dbNames: "",
    insertObj: {},

    insertedData(
        {
            _id = "1",
            email = "model@model.com",
            password = "VerySecrte",
            auth = false,
            dbName = "users",
            username = "Patito",
        } = {}
    ){ 
        this.dbNames = dbName;

        this.id = _id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.auth = auth;
        
        this.insertObj = {
            id:this.id,
            username:this.username,
            email:this.email,
            password:this.password,
            auth:this.auth,
        }

        //das in eine eigene Funktion
        this.db.use(dbName).insert(this.insertObj).then(
            //res => console.log(res)
        ).catch(
            console.log
        )
    },
}

module.exports = dbInsert; 