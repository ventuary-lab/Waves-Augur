# Waves DAO (Ventuary DAO)

## About:

https://blog.wavesplatform.com/waves-labs-to-use-dao-as-sandbox-for-grant-programs-d4b58413cb50

https://beta.ventuary.space/projects/feed

https://medium.com/@alexpupyshev/ventuary-dao-the-first-dao-on-waves-platform-f5fc1cb35b32




## Run docker

```sh
docker build -t ventuary .
docker run -itd --name ventuary --restart always -v ~/dev/ventuary:/data -p 5000:5000 ventuary
```


## Install to deploy

```
ln -s /var/www/ventuary-dao/repo/dev/nginx.conf /etc/nginx/sites-enabled/ventuary-dao.conf

```
