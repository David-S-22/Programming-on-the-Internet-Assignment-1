CREATE SCHEMA expenses;

CREATE TABLE expenses.expense (
    id integer NOT NULL,
    title text NOT NULL,
    category text NOT NULL,
    amount integer NOT NULL,
    cost real,
    date date,
    description text
);

ALTER TABLE expenses.expense ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME expenses.expense_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);