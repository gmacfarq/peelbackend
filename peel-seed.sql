-- seed the database with businesses
INSERT INTO businesses (id, name, description, website)
VALUES
        (1, 'Lofty Coffee', 'Lofty Coffee Co. is a specialty coffee roaster. Our cafes in Encinitas, San Diego and Solana Beach serve our fresh coffee, organic pastries and local breakfast and lunch menus.', 'https://www.loftycoffee.com'),
        (2, 'Romolo & Remo', 'Roman-style artisanal tomato sauces bringing diverse and multicultural experiences together through unique and balanced flavor sets.', 'https://www.romoloremo.com/'),
        (3, 'J.R. Organics', 'J.R. Organics is a 4th generation organic farm. Choose from jams, flowers, and some of your favorite fruits and vegetables', 'https://www.jrorganicsfarm.com/'),
        (4, '1000 Tiny Farms', '1000 Tiny Farms working to cultivate a regional network of market gardens to explore the social, environmental, and economic impacts of a small patch of land and the sharing of resources between farmers.', 'https://www.1000tinyfarms.com'),
        (5, 'Smit Farms', 'A California family farm that grows organic fruits and sells at farmers markets.', 'https://www.smitfarms.com'),
        (6, 'Stehly Organic Farms', 'Stehly Organic Farms is a multi generation Family farm in Valley Center, CA founded in the 1920’s and reimagined by brothers Jerome and Noel Stehly in 2002.', 'https://www.stehlyfarmsorganics.com/'),
        (7, 'Wonderland Farm', NULL, NULL);






-- seed the database with a buyer and a grower
INSERT INTO users (username, password, first_name, last_name, email, is_grower, is_admin)
VALUES ('testgrower',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Grower',
        'test@grower.com',
        TRUE,
        FALSE),
        ('testbuyer',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Buyer',
        'test@buyer.com',
        FALSE,
        FALSE),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Admin!',
        'test@admin.com',
        NULL,
        TRUE);

-- seed the database with users that have businesses
INSERT INTO users (username, password, first_name, last_name, email, business_id, is_grower, is_admin)
VALUES
        ('loftycoffee',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Lofty Coffee',
        'test@loftycoffee.com',
        1,
        FALSE,
        FALSE),

        ('romoloremo',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Romolo & Remo',
        'test@romoloremo.com',
        2,
        FALSE,
        FALSE),

        ('jrorganics',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'J.R. Organics',
        'test@jrorganics.com',
        3,
        TRUE,
        FALSE),

        ('1000tinyfarms',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        '1000 Tiny Farms',
        'test@1000tinyfarms.com',
        4,
        TRUE,
        FALSE),

        ('smitfarms',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Smit Farms',
        'test@smitfarms.com',
        5,
        TRUE,
        FALSE),

        ('stehlyfarms',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Stehly Organic Farms',
        'test@stehlyfarms.com',
        6,
        TRUE,
        FALSE),

        ('wonderlandfarm',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Wonderland Farm',
        'test@wonderlandfarm.com',
        7,
        TRUE,
        FALSE);



INSERT INTO produce (id, name, image_url)
VALUES
        (1, 'Tomatoes', 'https://www.example.com/tomatoes.jpg'),
        (2, 'Lettuce', 'https://www.example.com/lettuce.jpg'),
        (3, 'Carrots', 'https://www.example.com/carrots.jpg'),
        (4, 'Broccoli', 'https://www.example.com/broccoli.jpg'),
        (5, 'Cauliflower', 'https://www.example.com/cauliflower.jpg'),
        (6, 'Cucumbers', 'https://www.example.com/cucumbers.jpg'),
        (7, 'Peppers', 'https://www.example.com/peppers.jpg'),
        (8, 'Spinach', 'https://www.example.com/spinach.jpg'),
        (9, 'Kale', 'https://www.example.com/kale.jpg'),
        (10, 'Green Beans', 'https://www.example.com/greenbeans.jpg');

INSERT INTO products (name, description, website, image)
VALUES
        ('Tomato Sauce', 'Homemade tomato sauce', 'https://www.example.com/tomatosauce', 'https://www.example.com/tomatosauce.jpg'),
        ('Tomato Soup', 'Homemade tomato soup', 'https://www.example.com/tomatosoup', 'https://www.example.com/tomatosoup.jpg'),
        ('Tomato Juice', 'Homemade tomato juice', 'https://www.example.com/tomatojuice', 'https://www.example.com/tomatojuice.jpg'),
        ('Tomato Paste', 'Homemade tomato paste', 'https://www.example.com/tomatopaste', 'https://www.example.com/tomatopaste.jpg'),
        ('Tomato Salsa', 'Homemade tomato salsa', 'https://www.example.com/tomatosalsa', 'https://www.example.com/tomatosalsa.jpg'),
        ('Tomato Ketchup', 'Homemade tomato ketchup', 'https://www.example.com/tomatoketchup', 'https://www.example.com/tomatoketchup.jpg'),
        ('Tomato Salad', 'Homemade tomato salad', 'https://www.example.com/tomatosalad', 'https://www.example.com/tomatosalad.jpg'),
        ('Tomato Pie', 'Homemade tomato pie', 'https://www.example.com/tomatopie', 'https://www.example.com/tomatopie.jpg'),
        ('Tomato Pizza', 'Homemade tomato pizza', 'https://www.example.com/tomatopizza', 'https://www.example.com/tomatopizza.jpg'),
        ('Tomato Pasta', 'Homemade tomato pasta', 'https://www.example.com/tomatopasta', 'https://www.example.com/tomatopasta.jpg');

INSERT INTO requests (id, produce_id, username, quantity, price, receive_by, quantity_filled, status)
VALUES
        (1, 1, 'loftycoffee', 350, 4.00, '2020-12-31', 220, 'Active'),
        (2, 1, 'romoloremo', 70, 4.00, '2020-12-31', 70, 'Active'),
        (3, 1, 'loftycoffee', 350, 4.00, '2020-12-24', 350, 'Completed');

INSERT INTO orders (id, username, request_id, quantity, status)
VALUES
        (1, 'jrorganics', 3, 120, 'delivered'),
        (2, '1000tinyfarms', 3, 50, 'delivered'),
        (3, 'smitfarms', 3, 80, 'delivered'),
        (4, 'stehlyfarms', 3, 100, 'delivered'),
        (5, '1000tinyfarms', 2, 30, 'confirmed'),
        (6, 'smitfarms', 2, 40, 'confirmed'),
        (7, 'jrorganics', 1, 120, 'confirmed'),
        (8, '1000tinyfarms', 1, 50, 'confirmed'),
        (9, 'smitfarms', 1, 50, 'confirmed');
