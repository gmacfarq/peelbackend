-- Users table (One-to-Many relationship between Addresses and Users)
CREATE TABLE users (
  username VARCHAR(255) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
    CHECK (position('@' IN email) > 1),
  business_id INT
    REFERENCES businesses (id),
  profile_pic VARCHAR(255),
  cover_pic VARCHAR(255),
  is_grower BOOLEAN,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

-- Businesses table (One-to-One relationship between Users and Businesses)
CREATE TABLE businesses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  website VARCHAR(255)
)
-- Produce table (One-to-Many relationship between Businesses and Produce)
CREATE TABLE produce (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image_url VARCHAR(255)
);

-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  website VARCHAR(255),
  image_url VARCHAR(255)
);

-- Requests table (Many-to-Many relationship between Produce and Users)
CREATE TABLE requests (
  id SERIAL PRIMARY KEY,
  produce_id INT
    REFERENCES produce (id),
  username VARCHAR(255)
    REFERENCES users (username),
  quantity DECIMAL(10, 2) NOT NULL
    CHECK (quantity > 0),
  quantity_filled DECIMAL(10, 2) NOT NULL,
  price DECIMAL(10, 2) NOT NULL
    CHECK (price > 0),
  receive_by DATE
);

-- Offers table (Many-to-Many relationship between Produce and Users)
CREATE TABLE offers (
  id SERIAL PRIMARY KEY,
  produce_id INT
    REFERENCES produce (id),
  username VARCHAR(255)
    REFERENCES users (username),
  quantity_available DECIMAL(10, 2) NOT NULL
    CHECK (quantity_lbs > 0)
);

-- Orders table (Many-to-Many relationship between Requests and Users)
CREATE TABLE orders(
  id SERIAL PRIMARY KEY,
  username VARCHAR(255)
    REFERENCES users (username),
  request_id INT
    REFERENCES requests (id),
  quantity DECIMAL(10, 2) NOT NULL
    CHECK (quantity > 0),
  status VARCHAR(50) NOT NULL
);

-- Transactions or Orders table (Many-to-Many relationship between Offers and Users)
CREATE TABLE transactions (
  id INT PRIMARY KEY,
  buyer_id VARCHAR(255) NOT NULL
    REFERENCES users (username),
  order_id INT NOT NULL
    REFERENCES order (id),
  quantity DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL
);

-- Addresses or Locations table (One-to-Many relationship between Users and Addresses)
CREATE TABLE addresses (
  id INT PRIMARY KEY,
  username VARCHAR(255) NOT NULL
    REFERENCES users (username),
  street_address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(50) NOT NULL,
  postal_code VARCHAR(20) NOT NULL
  country VARCHAR(100) NOT NULL
);

-- Admin Actions table (One-to-Many relationship between Users and Admin Actions)
CREATE TABLE admin_actions (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL
    REFERENCES users (username),
  action VARCHAR(255) NOT NULL,
  action_date DATE NOT NULL
);