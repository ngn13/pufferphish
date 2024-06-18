<h1 align="center">
    Pufferphish 🐡 Simple phishing toolkit
</h1>

https://github.com/ngn13/pufferphish/assets/78868991/f04e76df-48bf-4e45-b583-bc81a673911c

<p align="center">
Pufferphish is a phising toolkit written in Go, it uses realtime websocket connection to communicate with the server.
</p>

---

## 😋 Setup
### ...with Docker
You can easily setup pufferphish with docker (assuming you already have docker installed):
```bash
mkdir pufferphish && cd pufferphish
wget https://github.com/ngn13/pufferphish/releases/download/v2.0/pufferphish_v2.0.tar.gz
tar xvf pufferphish_v2.0.tar.gz
docker run -d -v $PWD/config.json:/app/config.json \
              -v $PWD/templates:/app/templates     \
              -v $PWD/static:/app/static           \
              -v $PWD/logs:/app/logs               \
              --network host                       \
              ghcr.io/ngn13/pufferphish
```
Note that you will need restart the container after changing the configuration.

### ...without Docker
First install a recent version of `go`, then download the latest release archive:
```bash
wget https://github.com/ngn13/pufferphish/archive/refs/tags/v2.0.tar.gz
tar xvf v2.0.tar.gz && cd pufferphish-2.0
go build && ./pufferphish
```

### Reverse proxy with nginx
You can use nginx reverse proxy for HTTPS. Here is configuration that you can
copy and paste:
```conf
server {
  server_name [domain];

  location / {
    proxy_pass http://localhost:[port];
    proxy_set_header X-Real-IP $remote_addr;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```
You will need to add the following optio to your `config.json`:
```json
"ip_header": "X-Real-IP"
```

## ⚙️ Configuration
All the configuration is done with the `config.json` file, here are all the options:

- ### `port`
The port that the web server will listen on.

- ### `template`
The template that will be served, currently there are **3** avaliable
templates:
- Discord
- Steam
- Microsoft

Please note that these templates are mostly proof-of-concept, you should
write your own instead of using these. To get started see the [example template](templates/empty.html).

- ### `path`
The path that the web server will serve the template. Default is "/".

- ### `blacklist`
List of blacklisted IPs. Web server will return with 404 to these.

- ### `ip_header`
Header to use for obtaning client IP. If none specified web server will use the TCP
source IP, which should be the correct IP address unless you are running the application behind a reverse proxy.

## ❤️  Support
If you want to support this project, please consider leaving a star. Also consider contributing,
I am open for PRs and issues!
