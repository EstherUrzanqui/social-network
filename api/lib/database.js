require("dotenv").config();
const mysql = require("mysql");

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

const con = mysql.createConnection({
    host: DB_HOST || "127.0.0.1",
    user: DB_USER || "root",
    password: DB_PASS,
    database: DB_NAME || "socialnet",
    multipleStatements: true
  });

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    let useDatabase = `USE ${DB_NAME};`;
    con.query(useDatabase, function (err, result){
        if(err) throw err;
        console.log("Connection to `socialnet`database was successful")
    })

    let dropChildTables = 
        "DROP TABLE if exists shares; DROP TABLE if exists relationships;";
	con.query(dropChildTables, function (err, result) {
		if (err) throw err;
		console.log("Table deletion `shares and relationships` was successful!");
	
		console.log("Closing...");
    });
    
    let createUserQuery =
		"DROP TABLE if exists user; CREATE TABLE user(id int NOT NULL AUTO_INCREMENT, user_name varchar(155) NOT NULL, email varchar(100) NOT NULL, password varchar(155) NOT NULL, image text NULL, createdAt datetime NOT NULL, updatedAt datetime NOT NULL, PRIMARY KEY (id));";
	con.query(createUserQuery, function (err, result) {
		if (err) throw err;
		console.log("Table creation `companies` was successful!");

		console.log("Closing...");
    });
    
    let createSharesQuery =
		"DROP TABLE if exists shares; CREATE TABLE shares(id int NOT NULL AUTO_INCREMENT, user_id INT NOT NULL, body varchar(255) NOT NULL, createdAt datetime NOT NULL, updatedAt datetime NOT NULL, PRIMARY KEY (id));";
	con.query(createSharesQuery, function (err, result) {
		if (err) throw err;
		console.log("Table creation `shares` was successful!");

		console.log("Closing...");
    });
    
    let createRelationshipsQuery =
		"DROP TABLE if exists relationships; CREATE TABLE relationships(id int NOT NULL AUTO_INCREMENT, followerId INT NOT NULL, followedId INT NOT NULL, createdAt datetime NOT NULL, updatedAt datetime NOT NULL, PRIMARY KEY (id)) CREATE UNIQUE INDEX idx_follower_followed ON relationships (followerId, followedId);";
	con.query(createRelationshipsQuery, function (err, result) {
		if (err) throw err;
		console.log("Table creation `relationships` was successful!");

		console.log("Closing...");
    });
    
    let addForeignKeysQuery =
        "ALTER TABLE shares ADD CONSTRAINT shares_fk0 FOREIGN KEY (user_id) REFERENCES user(id);  ALTER TABLE relationships ADD CONSTRAINT relationships_fk0 FOREIGN KEY (followerId) REFERENCES user(id); ALTER TABLE relationships ADD CONSTRAINT relationships_fk1 FOREIGN KEY (followedId) REFERENCES user(id);"
    con.query(addForeignKeysQuery, function (err, result) {
        if (err) throw err;
        console.log("Added foreign keys successfuly!");
    
        console.log("Closing...");
    });

    con.end();

});