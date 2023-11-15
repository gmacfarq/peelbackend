-- seed the database with businesses
INSERT INTO businesses (name, description, website_url)
VALUES
        ('Farm Fresh Produce', 'Organic farm offering fresh produce', 'https://www.farmfreshproduce.com'),
        ('Green Pastures Farm', 'Family-owned farm offering grass-fed beef and free-range chicken', 'https://www.greenpasturesfarm.com'),
        ('The Hungry Bear', 'Family-friendly restaurant serving American cuisine', 'https://www.thehungrybear.com'),
        ('La Cucina Italiana', 'Authentic Italian restaurant with homemade pasta and sauces', 'https://www.lacucinaitaliana.com');

-- seed the database with a buyer and a grower
INSERT INTO users (username, password, first_name, last_name, email, business_id, profile_pic_url, is_grower, is_admin)
VALUES ('testgrower',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Grower',
        'test@grower.com',
        '1',
        'testgrowerpic',
        TRUE,
        FALSE),
        ('testbuyer',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Buyer',
        'test@buyer.com',
        '4',
        'testbuyerpic',
        FALSE,
        FALSE),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Admin!',
        'test@admin.com',
        NULL,
        NULL,
        'testadminpic',
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


