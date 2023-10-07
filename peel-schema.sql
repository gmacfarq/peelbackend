CREATE TABLE users (
  username VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE
    CHECK (position('@' IN email) > 1),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company_name TEXT,
  password TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  is_grower BOOLEAN,
  profile_pic VARCHAR(255)
);

-- Produce table
CREATE TABLE produce (
  produce_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

-- Requests table (Many-to-Many relationship between Produce and Users)
CREATE TABLE requests (
  request_id SERIAL PRIMARY KEY,
  produce_id INT
    REFERENCES produce (produce_id),
  username VARCHAR(255)
    REFERENCES users (username),
  quantity_lbs DECIMAL(10, 2) NOT NULL
    CHECK (quantity_lbs > 0),
  price DECIMAL(10, 2) NOT NULL
    CHECK (price > 0),
  request_date DATE
);

-- Categories or Tags table
CREATE TABLE categories (
  category_id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Produce Categories table (Many-to-Many relationship between Produce and Categories)
CREATE TABLE produce_categories (
  produce_id INT NOT NULL
    REFERENCES produce (produce_id),
  category_id INT NOT NULL
    REFERENCES categories (category_id),
  PRIMARY KEY (produce_id, category_id)
);

-- Reviews and Ratings table
CREATE TABLE reviews (
  review_id INT PRIMARY KEY,
  transaction_id INT NOT NULL
    REFERENCES transactions (transaction_id),
  produce_id INT NOT NULL
    REFERENCES produce (produce_id),
  rating INT NOT NULL,
  comment TEXT,
);

-- Images or Media table
CREATE TABLE media (
  media_id INT PRIMARY KEY,
  produce_id INT NOT NULL
    REFERENCES produce (produce_id),
  media_type VARCHAR(50) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
);

-- Transactions or Orders table
CREATE TABLE transactions (
  transaction_id INT PRIMARY KEY,
  buyer_id INT NOT NULL
    REFERENCES users (username),
  produce_id INT NOT NULL
    REFERENCES produce (produce_id),
  quantity INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL,
);

-- Conversations table
CREATE TABLE conversations (
  conversation_id INT PRIMARY KEY,
  user1_id INT NOT NULL
    REFERENCES users (username),
  user2_id INT NOT NULL
    REFERENCES users (username)
);

-- Messages table (related to Conversations)
CREATE TABLE messages (
  message_id INT PRIMARY KEY,
  conversation_id INT NOT NULL
    REFERENCES conversations (conversation_id),
  sender_id INT NOT NULL
    REFERENCES users (username),
  content TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL,
);

-- Addresses or Locations table
CREATE TABLE addresses (
  address_id INT PRIMARY KEY,
  username VARCHAR(255) NOT NULL
    REFERENCES users (username),
  street_address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(50) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  --country VARCHAR(100) NOT NULL,
);

-- Favorites or Wishlists table
CREATE TABLE favorites (
  favorite_id INT PRIMARY KEY,
  username VARCHAR(255) NOT NULL
    REFERENCES users (username),
  produce_id INT NOT NULL
    REFERENCES produce (produce_id),
);

-- Notifications table
CREATE TABLE notifications (
  notification_id INT PRIMARY KEY,
  username VARCHAR(255) NOT NULL
    REFERENCES users (username),
  message TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  is_read BOOLEAN NOT NULL,
);

-- Payment and Transactions History table
CREATE TABLE payment_history (
  payment_id INT PRIMARY KEY,
  username VARCHAR(255) NOT NULL
    REFERENCES users (username),
  amount DECIMAL(10, 2) NOT NULL,
  payment_date TIMESTAMP NOT NULL,
  payment_method VARCHAR(255) NOT NULL,
);

-- Admin or Moderation Actions table
CREATE TABLE admin_actions (
  admin_action_id INT PRIMARY KEY,
  admin_id INT NOT NULL
    REFERENCES users (username),
  action_type VARCHAR(255) NOT NULL,
  target_username VARCHAR(255)
    REFERENCES users (username),
  timestamp TIMESTAMP NOT NULL,
);

-- Settings and Preferences table
CREATE TABLE user_settings (
  username VARCHAR(255) PRIMARY KEY,
  setting_name VARCHAR(255) NOT NULL,
  setting_value VARCHAR(255) NOT NULL,
);

-- Static Content table
CREATE TABLE static_content (
  content_id INT PRIMARY KEY,
  content_type VARCHAR(255) NOT NULL,
  content_text TEXT NOT NULL,
);

-- Analytics and Logs table
CREATE TABLE analytics_logs (
  log_id INT PRIMARY KEY,
  username VARCHAR(255)
    REFERENCES users (username),
  log_type VARCHAR(255) NOT NULL,
  log_data TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL,
);