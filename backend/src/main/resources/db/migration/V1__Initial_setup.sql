CREATE TABLE users
(
    id       BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email    VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role     VARCHAR(50)  NOT NULL
);

CREATE TABLE categories
(
    id    BIGSERIAL PRIMARY KEY,
    name  VARCHAR(255) NOT NULL UNIQUE,
    image VARCHAR(255)
);

CREATE TABLE accounts
(
    id      BIGSERIAL PRIMARY KEY,
    name    VARCHAR(255) NOT NULL,
    balance BIGINT       NOT NULL,
    user_id BIGINT       NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE budgets
(
    id             BIGSERIAL PRIMARY KEY,
    spending_limit BIGINT NOT NULL,
    leftover       BIGINT NOT NULL,
    year_month     DATE   NOT NULL,
    category_id    BIGINT NOT NULL,
    user_id        BIGINT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE transactions
(
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    cost        BIGINT       NOT NULL,
    date        TIMESTAMP    NOT NULL,
    type        VARCHAR(255) NOT NULL,
    account_id     BIGINT       NOT NULL,
    category_id BIGINT       NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE
);