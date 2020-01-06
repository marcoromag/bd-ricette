#! /bin/bash
docker run --name=ricette -dP -v $PWD/server/api:/usr/share/api -v $PWD/webapp/build:/usr/share/webapp -p 8090:80 -p 3309:3306 romagnuolo/ricette
