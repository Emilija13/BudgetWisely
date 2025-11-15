CREATE TABLE recurring_transactions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cost BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    day_of_month INTEGER,
    day_of_week INTEGER,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    last_processed_date DATE,
    category_id BIGINT,
    account_id BIGINT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);

ALTER TABLE transactions
    ADD COLUMN recurring_transaction_id BIGINT,
    ADD COLUMN is_auto_generated BOOLEAN DEFAULT FALSE,
    ADD CONSTRAINT fk_recurring_transaction
        FOREIGN KEY (recurring_transaction_id)
            REFERENCES recurring_transactions(id);