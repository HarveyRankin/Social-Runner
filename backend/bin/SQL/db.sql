
CREATE TABLE USERS (
username VARCHAR(50) PRIMARY KEY,
pswrd VARCHAR(100),
email VARCHAR(50), 
isPrivate BOOLEAN
);

CREATE TABLE challenges (
challenge_id VARCHAR(50) PRIMARY KEY,
title VARCHAR(50),
score SMALLINT,
gps BOOLEAN, 
distance DECIMAL(4,2),
elevation BIGINT,
photo BOOLEAN,
user_description BOOLEAN,
description VARCHAR(300) NOT NULL
);

CREATE TABLE individual (
individual_id MEDIUMINT AUTO_INCREMENT PRIMARY KEY ,
start_date DATE NOT NULL,
end_date DATE NOT NULL,
challenge_id VARCHAR(50),
privacy VARCHAR(50),
club VARCHAR(50),
creator VARCHAR(50),
FOREIGN KEY(creator) REFERENCES USERS(username),
FOREIGN KEY(challenge_id) REFERENCES challenges(challenge_id)
);

CREATE TABLE bingo_card (
id VARCHAR(50) PRIMARY KEY,
start_date DATE NOT NULL,
end_date DATE NOT NULL,
privacy VARCHAR(50),
club VARCHAR(50),
creator VARCHAR(50),
title VARCHAR(50),
description VARCHAR(50),
rowsNum VARCHAR(50),
colsNum VARCHAR(50),
FOREIGN KEY(creator)REFERENCES USERS(username)
);

CREATE TABLE bingo_challenge(
id MEDIUMINT AUTO_INCREMENT PRIMARY KEY,
challenge_id VARCHAR(50),
bingo_id VARCHAR(50),
rowNum DECIMAL(4,2),
colNum DECIMAL(4,2),
FOREIGN KEY(challenge_id) REFERENCES challenges(challenge_id),
FOREIGN KEY(bingo_id)REFERENCES bingo_card(id)
);

CREATE TABLE athlete_joins_challenge (
username VARCHAR(50) NOT NULL,
individual_id MEDIUMINT NOT NULL,
PRIMARY KEY(username,individual_id),
FOREIGN KEY(username) REFERENCES USERS(username),
FOREIGN KEY(individual_id) REFERENCES individual(individual_id)
);

CREATE TABLE athlete_joins_card (
username VARCHAR(50)NOT NULL,
card_id VARCHAR(50)NOT NULL,
PRIMARY KEY(username,card_id),
FOREIGN KEY(username) REFERENCES USERS(username),
FOREIGN KEY(card_id) REFERENCES bingo_card(iD)
);

CREATE TABLE friend_requests (
id MEDIUMINT AUTO_INCREMENT PRIMARY KEY,
requstee VARCHAR(50),
requester VARCHAR(50),
pending BOOLEAN,
accepted BOOLEAN,
FOREIGN KEY(requstee) REFERENCES USERS(username),
FOREIGN KEY(requester) REFERENCES USERS(username)
);

CREATE TABLE completes_challenge (
id MEDIUMINT AUTO_INCREMENT PRIMARY KEY,
challenge_id VARCHAR(50) NOT NULL,
username VARCHAR(50) NOT NULL,
score SMALLINT,
ts DATETIME NOT NULL,
elevation BIGINT,
subTitle VARCHAR(50),
subDescription LONGTEXT,
distance DECIMAL(4,2),
pace DECIMAL(4,2),
runTime DECIMAL(5,2),
image LONGTEXT,
routeMap LONGTEXT,
isValid BOOLEAN,
FOREIGN KEY(username) REFERENCES USERS(username),
FOREIGN KEY(challenge_id) REFERENCES challenges(challenge_id)
);




 

CREATE TABLE Friends_with (
friend1 VARCHAR(50)NOT NULL,
friend2 VARCHAR(50)NOT NULL,
PRIMARY KEY(friend1,friend2),
FOREIGN KEY(friend1) REFERENCES USERS(username),
FOREIGN KEY(friend2) REFERENCES USERS(username)
);


CREATE TABLE comments_on (
comment_id MEDIUMINT AUTO_INCREMENT PRIMARY KEY,
commenter VARCHAR(50),
comment VARCHAR(500),
ts DATETIME,
challenge_complete_id MEDIUMINT,
FOREIGN KEY(challenge_complete_id) REFERENCES completes_challenge(id)
);

CREATE TABLE reacts_to (
submission_id MEDIUMINT NOT NULL,
user_id VARCHAR(50) NOT NULL,
PRIMARY KEY(submission_id,user_id),
FOREIGN KEY(submission_id)REFERENCES completes_challenge(id),
FOREIGN KEY(user_id) REFERENCES USERS(username)
);

CREATE TABLE clubs (
clubname VARCHAR(50)PRIMARY KEY,
creator VARCHAR(50),
FOREIGN KEY(creator)REFERENCES USERS(username)
);

CREATE TABLE follows_club (
clubname VARCHAR(50) NOT NULL,
username VARCHAR(50) NOT NULL,
PRIMARY KEY(clubname,username),
FOREIGN KEY(clubname) REFERENCES clubs(clubname),
FOREIGN KEY(username) REFERENCES USERS(username)
);

CREATE TABLE completes_row(
row_no TINYINT NOT NULL,
card_id VARCHAR(50) NOT NULL,
username VARCHAR(50),
score TINYINT,
PRIMARY KEY(row_no,card_id),
FOREIGN KEY(card_id) REFERENCES bingo_card(id),
FOREIGN KEY(username) REFERENCES USERS(username)
);
CREATE TABLE completes_col(
col_no TINYINT NOT NULL,
card_id VARCHAR(50) NOT NULL,
username VARCHAR(50),
score TINYINT,
PRIMARY KEY(col_no,card_id),
FOREIGN KEY(card_id) REFERENCES bingo_card(id),
FOREIGN KEY(username) REFERENCES USERS(username)
);

cCREATE TABLE completes_card (
id MEDIUMINT AUTO_INCREMENT PRIMARY KEY,
card_id VARCHAR(50),
username VARCHAR(50),
FOREIGN KEY(card_id) REFERENCES bingo_card(id),
FOREIGN KEY(username) REFERENCES USERS(username)
);



SELECT card_id,COUNT(row_no) as numOfRows from completes_row WHERE username = 'Larrylightbulb'
GROUP BY username;

SELECT SUM(score) as overallScore, c.username FROM completes_challenge c INNER JOIN bingo_challenge i ON (c.challenge_id = i.challenge_id)
INNER JOIN bingo_card b ON (b.id = i.bingo_id)
WHERE b.id = '69addf27-df20-45d4-90fa-63dd2d281858'
group by c.username;

SELECT COUNT(col_no) as overallScore,username FROM completes_col WHERE card_id = '3193128e-d4e9-41f8-9e3a-39eb79041c9d'
GROUP BY username;

SELECT * FROM completes_card WHERE card_id = '675b79f9-8d63-4c9d-8d1a-8451a2fc156c' AND username = 'Larrylightbulb1'

SELECT * FROM completes_col WHERE card_id = '69addf27-df20-45d4-90fa-63dd2d281858';
SELECT * FROM completes_card;
SELECT * FROM completes_col;
SELECT * FROM completes_row;
SELECT * FROM completes_challenge;
SELECT * FROM follows_club;
SELECT * FROM clubs;
SELECT * FROM bingo_card;
SELECT * FROM Friends_with;
SELECT * FROM friend_requests;
SELECT * FROM bingo_challenge;
SELECT * FROM reacts_to;
SELECT * FROM challenges;
SELECT * FROM individual;
SELECT * FROM USERS;
SELECT * FROM athlete_joins_challenge;
SELECT * FROM athlete_joins_card;
SELECT * FROM completes_challenge;
SELECT * FROM comments_on;