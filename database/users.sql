CREATE TABLE "user" (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

INSERT INTO users (name, email, password, role) VALUES ('Admin', 'tiagobrr17@gmail.com','1234567','admin');
