"use strict"
const dbInsert = {
    db          : require("./couch.js"),
    dbName      : "",
    insertObj   : {},

    insertedData(
        {
            _id         = "1",
            email       = "model@model.com",
            password    = "VerySecret",
            auth        = false,
            dbName      = "users",
            username    = "Patito",
            active      = "0",
            hash        = "0",
        } = {}
    ){ 
        this.dbName     = dbName;
        this.id         = _id;
        this.username   = username;
        this.email      = email;
        this.password   = password;
        this.auth       = auth;
        this.active     = active;
        this.hash       = hash;
        
        this.insertObj = {
            id          :this.id,
            username    :this.username,
            email       :this.email,
            password    :this.password,
            auth        :this.auth,
            active      :this.active,
            hash        :this.hash 
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