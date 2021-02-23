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
    thumbnailPath VARCHAR(128),
    photoPath VARCHAR(128),
    CONSTRAINT FK_RESTAURANT_LOCATION FOREIGN KEY(location_id) REFERENCES location(id),
    FULLTEXT(name)
);
INSERT INTO user(name, password, email, phone) VALUES('Iancu Vlad', '$2b$10$FSLVtYgpPx21pjxpUPnbdOP.VtsF1BDAymK2JePjraNGNG139IOna', 'my@email.com', '0721711423');

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

INSERT INTO restaurant(name, location_id) VALUES('Taco Bell', 2);
INSERT INTO restaurant(name, location_id) VALUES('Brazilian Cuisine', 2);
INSERT INTO restaurant(name, location_id) VALUES('Voila! Cucina', 2);

INSERT INTO restaurant(name, location_id) VALUES('Saladbox', 3);
INSERT INTO restaurant(name, location_id) VALUES('Best Junk Food', 3);
INSERT INTO restaurant(name, location_id) VALUES('Cody\'s Pizza', 3);

INSERT INTO restaurant(name, location_id) VALUES('Lucky on Provisions', 4);
INSERT INTO restaurant(name, location_id) VALUES('Saffron Blossom', 4);
INSERT INTO restaurant(name, location_id) VALUES('Garden House', 4);

INSERT INTO restaurant(name, location_id) VALUES('Howling Honeybee Kitchen', 5);
INSERT INTO restaurant(name, location_id) VALUES('Latern Bar and Grille', 5);
INSERT INTO restaurant(name, location_id) VALUES('Golden Bliss Eatery', 5);

INSERT INTO restaurant(name, location_id) VALUES('Mystic Fox Supper Club',  6);
INSERT INTO restaurant(name, location_id) VALUES('Bliss Canteen', 6);
INSERT INTO restaurant(name, location_id) VALUES('New Dahila Ristorante', 6);

INSERT INTO restaurant(name, location_id) VALUES('Gourmet on Str.Ferdinand',  7);
INSERT INTO restaurant(name, location_id) VALUES('Bold Lighthouse', 7);
INSERT INTO restaurant(name, location_id) VALUES('Craveable Pines Cookery', 7);

INSERT INTO restaurant(name, location_id) VALUES('Grove Provisions',  8);
INSERT INTO restaurant(name, location_id) VALUES('Pickled Fox Bistro', 8);
INSERT INTO restaurant(name, location_id) VALUES('Follow the Charm Cookery',    8);

INSERT INTO restaurant(name, location_id) VALUES('Savory Blaze Farmhouse',  9);
INSERT INTO restaurant(name, location_id) VALUES('Loyal Nomad & Co.', 9);
INSERT INTO restaurant(name, location_id) VALUES('New Kettle House',    9);

INSERT INTO restaurant(name, location_id) VALUES('The Oak Roadhouse',  10);
INSERT INTO restaurant(name, location_id) VALUES('Moonlit Wish Lounge', 10);
INSERT INTO restaurant(name, location_id) VALUES('Lost Thyme Cucina',    10);

INSERT INTO restaurant(name, location_id) VALUES('Mellow Fete Roadhouse',  11);
INSERT INTO restaurant(name, location_id) VALUES('Farmer\'s Falcon Restaurant', 11);
INSERT INTO restaurant(name, location_id) VALUES('Crafted Sails Provisions',    11);

INSERT INTO restaurant(name, location_id) VALUES('Enchanted Fire Lounge',  12);
INSERT INTO restaurant(name, location_id) VALUES('Southern Bite House', 12);
INSERT INTO restaurant(name, location_id) VALUES('Proud Taste Farmhouse',    12);

INSERT INTO restaurant(name, location_id) VALUES('Crimson Harvest Pubhouse',  13);
INSERT INTO restaurant(name, location_id) VALUES('Marie\'s Burgers', 13);
INSERT INTO restaurant(name, location_id) VALUES('Saffron Spoon Pub',    13);

INSERT INTO restaurant(name, location_id) VALUES('Rosy Pail Bar and Grill',  14);
INSERT INTO restaurant(name, location_id) VALUES('Ciao! Cuisine', 14);
INSERT INTO restaurant(name, location_id) VALUES('Merry Moment Cuisine',    14);

INSERT INTO restaurant(name, location_id) VALUES('Follow the Bell Cookery',  15);
INSERT INTO restaurant(name, location_id) VALUES('The Spoon Inn', 15);
INSERT INTO restaurant(name, location_id) VALUES('Lost on Via Appia Cuisine',    15);

INSERT INTO restaurant(name, location_id) VALUES('Moonlit Owl House',  16);
INSERT INTO restaurant(name, location_id) VALUES('Rustic Mirror & Co.', 16);
INSERT INTO restaurant(name, location_id) VALUES('Zebra Cucina',    16);

INSERT INTO restaurant(name, location_id) VALUES('Original Palm Eatery',  17);
INSERT INTO restaurant(name, location_id) VALUES('Charmed Platter Lodge', 17);
INSERT INTO restaurant(name, location_id) VALUES('Great Tiger Cucina',    17);

INSERT INTO restaurant(name, location_id) VALUES('The Forest Bar and Grill',  18);
INSERT INTO restaurant(name, location_id) VALUES('Moonshine Tractor Bar and Grill', 18);
INSERT INTO restaurant(name, location_id) VALUES('Tilted Flame Canteen',    18);

INSERT INTO restaurant(name, location_id) VALUES('Hidden Jester Roadhouse',  19);
INSERT INTO restaurant(name, location_id) VALUES('Sailing Alley Trattoria', 19);
INSERT INTO restaurant(name, location_id) VALUES('Jeweled Cow Bistro',    19);

INSERT INTO restaurant(name, location_id) VALUES('Bazaar Farmhouse',  20);
INSERT INTO restaurant(name, location_id) VALUES('Sweet Table Provisions', 20);
INSERT INTO restaurant(name, location_id) VALUES('Handsome Rabbit Chophouse',    20);

UPDATE restaurant SET photoPath = 'restaurants/photo/restaurant' + (id % 10 + 1) + '.jpeg'