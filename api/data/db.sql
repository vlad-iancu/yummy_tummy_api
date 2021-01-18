DROP TABLE IF EXISTS user;

CREATE TABLE user(
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(64),
    password VARCHAR(128),
    email VARCHAR(128),
    phone VARCHAR(16),
    UNIQUE(email),
    UNIQUE(phone)
);