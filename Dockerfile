FROM redislabs/rejson
COPY redis.conf /usr/local/etc/redis/redis.conf
COPY package.json /home/udi/.......
RUN npm i
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]
RUN npm load-mot-csv.js