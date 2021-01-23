BEGIN;

INSERT INTO groupmembers
    (member_name, dollars)
VALUES
    ('Billy', 100),
    ('Suzy', 100),
    ('Spot', 150),
    ('Dad', 100),
    ('Mom', 100);

COMMIT;