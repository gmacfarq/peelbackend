-- seed the database with businesses
INSERT INTO businesses (name, description, website)
VALUES
        ('Farm Fresh Produce', 'Organic farm offering fresh produce', 'https://www.farmfreshproduce.com'),
        ('Green Pastures Farm', 'Family-owned farm offering grass-fed beef and free-range chicken', 'https://www.greenpasturesfarm.com'),
        ('The Hungry Bear', 'Family-friendly restaurant serving American cuisine', 'https://www.thehungrybear.com'),
        ('La Cucina Italiana', 'Authentic Italian restaurant with homemade pasta and sauces', 'https://www.lacucinaitaliana.com');

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

INSERT INTO produce (name, image_url)
VALUES
        ('Tomatoes', 'https://www.example.com/tomatoes.jpg'),
        ('Lettuce', 'https://www.example.com/lettuce.jpg'),
        ('Carrots', 'https://www.example.com/carrots.jpg'),
        ('Broccoli', 'https://www.example.com/broccoli.jpg'),
        ('Cauliflower', 'https://www.example.com/cauliflower.jpg'),
        ('Cucumbers', 'https://www.example.com/cucumbers.jpg'),
        ('Peppers', 'https://www.example.com/peppers.jpg'),
        ('Spinach', 'https://www.example.com/spinach.jpg'),
        ('Kale', 'https://www.example.com/kale.jpg'),
        ('Green Beans', 'https://www.example.com/greenbeans.jpg');

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