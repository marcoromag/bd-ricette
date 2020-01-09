#! /bin/bash 

echo "Create DB"
mysql -u root < 01-schema.sql || exit -1
mysql -u root < 02-data.sql || exit -1
