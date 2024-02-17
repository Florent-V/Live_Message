INSERT INTO granted_mail (mail) VALUES ('vasseurflorent@gmail.com'), ('test1@mail.fr');
UPDATE user SET roles = JSON_ARRAY_APPEND(roles, '$', 'ROLE_ADMIN') WHERE id = 6;
