DROP TABLE IF EXISTS restaurant;
DROP TABLE IF EXISTS location;
DROP TABLE IF EXISTS user;

CREATE TABLE user(
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(64),
    password VARCHAR(128),
    email VARCHAR(128),
    phone VARCHAR(16),
    photoPath VARCHAR(128),
    UNIQUE(email),
    UNIQUE(phone)
);

CREATE TABLE location(
	id INT PRIMARY KEY NOT NULL,
    name VARCHAR(64)
);

CREATE TABLE restaurant(
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(64),
    location_id INT,
    CONSTRAINT FK_RESTAURANT_LOCATION FOREIGN KEY(location_id) REFERENCES location(id),
    FULLTEXT(name)
);

INSERT INTO location VALUES(1, 'Bucharest');
INSERT INTO location VALUES(2, 'Warsaw');
INSERT INTO location VALUES(3, 'Vilnius');
INSERT INTO location VALUES(4, 'Riga');
INSERT INTO location VALUES(5, 'Tallin');
INSERT INTO location VALUES(6, 'New York');
INSERT INTO location VALUES(7, 'Stockholm');
INSERT INTO location VALUES(8, 'Paris');
INSERT INTO location VALUES(9, 'Oslo');
INSERT INTO location VALUES(10, 'Berlin');
INSERT INTO location VALUES(11, 'Athens');
INSERT INTO location VALUES(12, 'Belgrade');
INSERT INTO location VALUES(13, 'Vienna');
INSERT INTO location VALUES(14, 'Rome');
INSERT INTO location VALUES(15, 'Madrid');
INSERT INTO location VALUES(16, 'Lisbon');
INSERT INTO location VALUES(17, 'Tokio');
INSERT INTO location VALUES(18, 'Taipei');
INSERT INTO location VALUES(19, 'Houston');
INSERT INTO location VALUES(20, 'London');

INSERT INTO restaurant(name, location_id) VALUES('Tony\'s Shaorma', 1);
INSERT INTO restaurant(name, location_id) VALUES('Marie\'s Burgers', 1);
INSERT INTO restaurant(name, location_id) VALUES('Tom\'s Salads', 1);

INSERT INTO restaurant(name, location_id) VALUES('Tony\'s Shaorma', 2);
INSERT INTO restaurant(name, location_id) VALUES('Marie\'s Burgers', 2);
INSERT INTO restaurant(name, location_id) VALUES('Tom\'s Salads', 2);

INSERT INTO restaurant(name, location_id) VALUES('Tony\'s Shaorma', 3);
INSERT INTO restaurant(name, location_id) VALUES('Marie\'s Burgers', 3);
INSERT INTO restaurant(name, location_id) VALUES('Tom\'s Salads', 3);

INSERT INTO restaurant(name, location_id) VALUES('Tony\'s Shaorma', 4);
INSERT INTO restaurant(name, location_id) VALUES('Marie\'s Burgers', 4);
INSERT INTO restaurant(name, location_id) VALUES('Tom\'s Salads', 4);

INSERT INTO restaurant(name, location_id) VALUES('Tony\'s Shaorma', 5);
INSERT INTO restaurant(name, location_id) VALUES('Marie\'s Burgers', 5);
INSERT INTO restaurant(name, location_id) VALUES('Tom\'s Salads', 5);

INSERT INTO restaurant(name, location_id) VALUES('Tony\'s Shaorma',  6);
INSERT INTO restaurant(name, location_id) VALUES('Marie\'s Burgers', 6);
INSERT INTO restaurant(name, location_id) VALUES('Tom\'s Salads',    6);

INSERT INTO restaurant(name, location_id) VALUES('Tony\'s Shaorma',  7);
INSERT INTO restaurant(name, location_id) VALUES('Marie\'s Burgers', 7);
INSERT INTO restaurant(name, location_id) VALUES('Tom\'s Salads',    7);

INSERT INTO restaurant(name, location_id) VALUES('Tony\'s Shaorma',  8);
INSERT INTO restaurant(name, location_id) VALUES('Marie\'s Burgers', 8);
INSERT INTO restaurant(name, location_id) VALUES('Tom\'s Salads',    8);

INSERT INTO restaurant(name, location_id) VALUES('Tony\'s Shaorma',  9);
INSERT INTO restaurant(name, location_id) VALUES('Marie\'s Burgers', 9);
INSERT INTO restaurant(name, location_id) VALUES('Tom\'s Salads',    9);

INSERT INTO restaurant(name, location_id) VALUES('Tony\'s Shaorma',  10);
INSERT INTO restaurant(name, location_id) VALUES('Marie\'s Burgers', 10);
INSERT INTO restaurant(name, location_id) VALUES('Tom\'s Salads',    10);

INSERT INTO restaurant(name, location_id) VALUES('Tony\'s Shaorma',  11);
INSERT INTO restaurant(name, location_id) VALUES('Marie\'s Burgers', 11);
INSERT INTO restaurant(name, location_id) VALUES('Tom\'s Salads',    11);

INSERT INTO restaurant(name, location_id) VALUES('Tony\'s Shaorma',  12);
INSERT INTO restaurant(name, location_id) VALUES('Marie\'s Burgers', 12);
INSERT INTO restaurant(name, location_id) VALUES('Tom\'s Salads',    12);

INSERT INTO restaurant(name, location_id) VALUES('Tony\'s Shaorma',  13);
INSERT INTO restaurant(name, location_id) VALUES('Marie\'s Burgers', 13);
INSERT INTO restaurant(name, location_id) VALUES('Tom\'s Salads',    13);

INSERT INTO restaurant(name, location_id) VALUES('Tony\'s Shaorma',  14);
INSERT INTO restaurant(name, location_id) VALUES('Marie\'s Burgers', 14);
INSERT INTO restaurant(name, location_id) VALUES('Tom\'s Salads',    14);

INSERT INTO restaurant(name, location_id) VALUES('Tony\'s Shaorma',  15);
INSERT INTO restaurant(name, location_id) VALUES('Marie\'s Burgers', 15);
INSERT INTO restaurant(name, location_id) VALUES('Tom\'s Salads',    15);

INSERT INTO restaurant(name, location_id) VALUES('Tony\'s Shaorma',  16);
INSERT INTO restaurant(name, location_id) VALUES('Marie\'s Burgers', 16);
INSERT INTO restaurant(name, location_id) VALUES('Tom\'s Salads',    16);

INSERT INTO restaurant(name, location_id) VALUES('Tony\'s Shaorma',  17);
INSERT INTO restaurant(name, location_id) VALUES('Marie\'s Burgers', 17);
INSERT INTO restaurant(name, location_id) VALUES('Tom\'s Salads',    17);

INSERT INTO restaurant(name, location_id) VALUES('Tony\'s Shaorma',  18);
INSERT INTO restaurant(name, location_id) VALUES('Marie\'s Burgers', 18);
INSERT INTO restaurant(name, location_id) VALUES('Tom\'s Salads',    18);

INSERT INTO restaurant(name, location_id) VALUES('Tony\'s Shaorma',  19);
INSERT INTO restaurant(name, location_id) VALUES('Marie\'s Burgers', 19);
INSERT INTO restaurant(name, location_id) VALUES('Tom\'s Salads',    19);

INSERT INTO restaurant(name, location_id) VALUES('Tony\'s Shaorma',  20);
INSERT INTO restaurant(name, location_id) VALUES('Marie\'s Burgers', 20);
INSERT INTO restaurant(name, location_id) VALUES('Tom\'s Salads',    20);