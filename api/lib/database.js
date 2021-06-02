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
		"DROP TABLE if exists user; CREATE TABLE user(id int NOT NULL AUTO_INCREMENT, user_name varchar(155) NOT NULL, email varchar(155) NOT NULL, password varchar(155) NOT NULL, password2 varchar(155), image text NULL, background_image text NULL, PRIMARY KEY (id));";
	con.query(createUserQuery, function (err, result) {
		if (err) throw err;
		console.log("Table creation `companies` was successful!");

		console.log("Closing...");
    });
    
    let createSharesQuery =
		"DROP TABLE if exists shares; CREATE TABLE shares(id int NOT NULL AUTO_INCREMENT, user_id INT NOT NULL, body text NOT NULL, createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP, updatedAt timestamp NULL DEFAULT NULL, pictures text, likes int DEFAULT 0, PRIMARY KEY (id));";
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
        "ALTER TABLE shares ADD CONSTRAINT shares_fk0 FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE;  ALTER TABLE relationships ADD CONSTRAINT relationships_fk1 FOREIGN KEY (followerId) REFERENCES user(id) ON DELETE CASCADE; ALTER TABLE relationships ADD CONSTRAINT relationships_fk2 FOREIGN KEY (followedId) REFERENCES user(id) ON DELETE CASCADE;"
    con.query(addForeignKeysQuery, function (err, result) {
        if (err) throw err;
        console.log("Added foreign keys successfuly!");
    
        console.log("Closing...");
    });

    let createLikesUsersQuery =
    "DROP TABLE if exists likes_users; CREATE TABLE likes_users(id int NOT NULL AUTO_INCREMENT, shares_id int NOT NULL, user_id int NOT NULL, likes int NOT NULL DEFAULT '0', PRIMARY KEY (id), KEY shares_id (shares_id), KEY messages_id (user_id));"
    con.query(createLikesUsersQuery, function (err, result) {
      if(err) throw err;
      console.log("Table creating `likes_users` was successful!");

      console.log("Closing...")
    })

    let createMessagesQuery = 
    "DROP TABLE if exists messages; CREATE TABLE messages(id int NOT NULL AUTO_INCREMENT, user_id int DEFAULT NULL, body varchar(255) DEFAULT NULL, createdAt timestamp NULL DEFAULT NULL, shares_id int NOT NULL, PRIMARY KEY(id));"

    con.end();

});