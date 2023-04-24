create database vacations;


use vacations;


CREATE TABLE users (
id   INT NOT NULL AUTO_INCREMENT ,
firstName VARCHAR(255) not null,
lastName varchar(255) not null,
email varchar(255)unique not null,
password varchar(255) unique not null ,
role varchar(255) not null,
PRIMARY KEY (id)
);


INSERT INTO users (firstName, lastName, email, password, role)
values

('admin', 'admin', 'admin@gmail.com', 'admin1234', 'admin') ,
('Elie', 'Zenou', 'elie@gmail.com', 'elie1234', 'user') ,
('david', 'gallula', 'dgallula@gmail.com', 'david1234', 'user' );

select * from users;


CREATE TABLE vacations (
id   INT NOT NULL AUTO_INCREMENT ,
destination VARCHAR(255) not null,
description VARCHAR(255) not null,
image VARCHAR(255) not null,
price int not null,
startDate datetime not null,
EndDate datetime not null,
followers int not null,
userId int not null,
PRIMARY KEY (id),
FOREIGN KEY(userId) REFERENCES users(id)
);

INSERT INTO vacations ( destination, description, image, price, startDate, endDate, followers,userId)
VALUES

( 'Hawaii', 'wonderfull','Hawaii.jpg', 1499, '2022-06-23', '2022-06-30',  1000,1),
('Eilat', ' Splendid','Eilat.jpg', 1399, '2020-07-23', '2022-07-30', 2000,2),
('Paris', 'Grandiose!','Paris.jpg', 1399, '2020-07-23', '2022-07-30', 2000,2),
( 'Maldives', 'The paradise','Maldives.jpg', 1699, '2022-08-23', '2022-08-30', 10000,3);


CREATE TABLE users_vacations (
id   INT NOT NULL AUTO_INCREMENT ,
userId int not null,
vacationId int not null,
PRIMARY KEY (id),
FOREIGN KEY(userId) REFERENCES users(id),
FOREIGN KEY(vacationId) REFERENCES vacations(id)
);

INSERT INTO users_vacations ( userId, vacationId)
VALUES
(1,1),
(2,2);