#!/bin/bash

echo "configuring database: mydb"

dropdb -U node diss
createdb -U node diss
psql -U node diss <./bin/SQL/db.sql

echo "mydb cofigured"   