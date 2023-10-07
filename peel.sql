\echo 'Delete and recreate peel db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE peel;
CREATE DATABASE peel;
\connect peel

\i peel-schema.sql
\i peel-seed.sql

\echo 'Delete and recreate peel_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE peel_test;
CREATE DATABASE peel_test;
\connect peel_test

\i peel-schema.sql
