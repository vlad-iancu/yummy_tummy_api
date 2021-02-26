DROP TABLE IF EXISTS restaurant;
DROP TABLE IF EXISTS location;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS user_validation;
CREATE TABLE user_validation(
    code VARCHAR(16) PRIMARY KEY NOT NULL,
    expiration INT(11)
);

CREATE TABLE user(
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(64),
    password VARCHAR(128),
    email VARCHAR(128),
    phone VARCHAR(16),
    photoPath VARCHAR(128),
    phoneCode VARCHAR(16),
    emailCode VARCHAR(16),
    UNIQUE(email),
    UNIQUE(phone),
    CONSTRAINT FK_EMAIL_CODE FOREIGN KEY(emailCode) REFERENCES user_validation(code),
    CONSTRAINT FK_PHONE_CODE FOREIGN KEY(phoneCode) REFERENCES user_validation(code)
);

CREATE TABLE location(
	id INT PRIMARY KEY NOT NULL,
    name VARCHAR(64)
);

CREATE TABLE restaurant(
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(64),
    locationId INT,
    thumbnailPath VARCHAR(128),
    photoPath VARCHAR(128),
    CONSTRAINT FK_RESTAURANT_LOCATION FOREIGN KEY(locationId) REFERENCES location(id),
    FULLTEXT(name)
);