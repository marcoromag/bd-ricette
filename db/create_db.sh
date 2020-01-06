#! /bin/bash 

echo "Create DB"
mysql -u root < 01-schema.sql || exit -1
