INSERT INTO users (username, email, password, role)
VALUES ('user', 'user@gmail.com', '$2a$10$eWTMchv5QO6CqL80enM9/OI4NcRwNsrRtjMgni.jnEmazKSe30WCe', 'USER');

INSERT INTO accounts (name, balance, user_id)
VALUES
    ('Wallet', 2500, (SELECT id FROM users WHERE email = 'user@gmail.com')),
    ('Visa 5452', 1800, (SELECT id FROM users WHERE email = 'user@gmail.com'));


INSERT INTO accounts_history (balance, total_balance, timestamp, created_at, account_id)
VALUES
    (2500, 2500, '2024-12-01T00:00:00', '2024-12-01T00:00:00', (SELECT id FROM accounts WHERE name = 'Wallet')),
    (1800, 4300, '2024-12-02T00:00:00', '2024-12-02T00:00:00', (SELECT id FROM accounts WHERE name = 'Visa 5452'));


INSERT INTO categories(name, image)
VALUES
    ('Groceries', 'https://cdn-icons-png.flaticon.com/512/291/291893.png'),
    ('Pets', 'https://cdn-icons-png.flaticon.com/512/8409/8409707.png'),
    ('Clothes', 'https://cdn-icons-png.flaticon.com/512/1856/1856030.png'),
    ('Gas', 'https://cdn-icons-png.freepik.com/512/316/316377.png'),
    ('Going Out', 'https://cdn-icons-png.flaticon.com/512/5444/5444053.png'),
    ('Income', 'https://cdn-icons-png.flaticon.com/512/7921/7921493.png');

INSERT INTO budgets(spending_limit, leftover, year_month, category_id, user_id)
VALUES
    (2000, 2000, '2024-12-01', (SELECT id FROM categories WHERE name = 'Groceries'), (SELECT id FROM users WHERE email = 'user@gmail.com')),
    (1700, 1700, '2024-12-01', (SELECT id FROM categories WHERE name = 'Pets'), (SELECT id FROM users WHERE email = 'user@gmail.com'));
