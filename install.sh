# !/bin/bash

git pull
cp -rf * /usr/apps/wellness-fit/
pm2 restart wellness-fit
pm2 save