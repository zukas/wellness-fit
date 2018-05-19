# !/bin/bash

git pull
cp -rf * /usr/apps/@set@/
pm2 restart @set@
pm2 save