# Server configuration (Ubuntu 18)

## Ports configuration
You have to enable port 80 on the server. You can add those either while instance setup or in the security tab of the instance, in security groups

## NGINX installation
https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-18-04

## MongoDB installation
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

## Install NVM
https://github.com/nvm-sh/nvm#installing-and-updating

Then restart or `source /home/ubuntu/.bashrc`

## Install Node.js
`nvm install 16`

## Install git
`sudo apt update`
`sudo apt install git`

## Clone
`git clone git@github.com:rulikrulit/jails.git`
`cd jails`
`git checkout skipiti`

## Create DB
`mongo`
`use jails`
`exit`

## Configure NXINX
`sudo touch /etc/nginx/sites-available/jails` 
`sudo vi /etc/nginx/sites-available/jails`

Update content:
```
server {
        listen 80;
        listen [::]:80;

        root /home/ubuntu/jails/public;
        index index.html index.htm index.nginx-debian.html;

        server_name _;

        location /app/ {
            proxy_pass  http://127.0.0.1:5000/;
        }

        location /ws {
            proxy_pass  http://127.0.0.1:8001;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }

        location / {
                try_files $uri $uri/ =404;
        }
}
```

Link file:
`sudo ln -s /etc/nginx/sites-available/jails /etc/nginx/sites-enabled/`

`sudo vi /etc/nginx/nginx.conf`
Remove hash at `server_names_hash_bucket_size 64;`
Restart NGINX


