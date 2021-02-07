DROP TABLE IF EXISTS restaurant;
DROP TABLE IF EXISTS location;
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

CREATE TABLE location(
	id INT PRIMARY KEY NOT NULL,
    name VARCHAR(64)
);

CREATE TABLE restaurant(
	id INT PRIMARY KEY NOT NULL,
    name VARCHAR(64),
    location_id INT,
    CONSTRAINT FK_RESTAURANT_LOCATION FOREIGN KEY(location_id) REFERENCES location(id)
);