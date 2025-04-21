# Deploying on AWS

    - EC2 - Elastic Compute 2 (helps to create VM)

        - We create a key value pair for login
        - its done using encryption technique
        - a pem file is generated containing the keys

    - to SSH into the instance
        - fist we need to change the permissions of the .pem file
            - chmod 400 <secret>.pem
        - then just ssh into the machine using
            - ssh -i <secret>.pem machine_address
            -  ssh -i "devTinder-secret.pem" ubuntu@ec2-65-0-20-221.ap-south-1.compute.amazon

    - Install node using nvm curl, same version
    - Clone the repos from the github to the instance

    - Frontend
        - npm install to install the dependencies
        - npm run dev is for the local system, that's not how you run it while deploying
        - vite is the bundler, we need to build the project ( npm run build ), It will generate dist folder that contains the optimized files, which will be deployed

        - To host frontend app we need nginx, 
            - Nginx - It is a free, open-source software, can be used for multiple purposes
                - Web Server
                - Load Balancer
                - Reverse proxy
                - Content cache
                - Mail proxy
            - sudo apt update
            - sudo apt install nginx
            - STARTING NIGNX
                - sudo systemctl start nginx
            - ENABLE NGINX
                - sudo systemctl enable nginx
        - Copy the code to the NGINX server repository (code -> /var/www/html)
            - sudo scp -r dist/* /var/www/html
            - scp is a copy command

        - AWS blocks all our ports, but our server is runnning on port no 80
            - Gotta enable/expose port 80
            - Go to the instance security rules and add the inbound security rule

    - Backend
        - Clone the repo
        - Add the envs
        - Allow ec2 instance ip on the mongo server
        - Use pm2 to keep the server live all the time
            - PM2 is a daemon process manager that will help you manage and keep your application running online 24/7
            - npm install pm2 -g

        - to start your server as process using pm2
            - pm2 start npm -- start
        - to check pm2 log
            - pm2 logs
        - to flush the logs
            - pm2 flush
        - to stop the server
            - pm2 stop npm
        - to delete the process
            - pm2 delete npm
        - to name the process
            - pm2 start npm --name "<custom name>" -- start

    Frontend => http://43.204.96.49/
    Backend => http://43.204.96.49:3000/

    Domain Name = devtinder.com => 43.204.96.49

    Frontend = devtinder.com
    Backend = devtinder.com:3000 => devtinder.com/api

    - for the above use case we use Nginx proxy pass
    - Every request goes through the nginx that's why it acts like a load balancer
    - Proxy pass config for nginx
        - this nginx config file is present in /etc/nginx/sites-available/default
            -  server_name 65.0.20.221;

                location /api/ {
                        proxy_pass http://localhost:3000/; # pass the request to Node.js server
                        proxy_http_version 1.1;
                        proxy_set_header Upgrade $http_upgrade;
                        proxy_set_header Connection 'upgrade';
                        proxy_set_header Host $host;
                        proxy_cache_bypass $http_upgrade;
                }
    - After the nginx config always restart NGINX
    - Now we need to add /api in while we call the api from the frontend

# Domain Name Mapping
    - Mapping the ip address to the domain name
        - Buy the domain you want
        - Go the DNS management of your domain, either in the DNS providers or cloudflare
            - Domain name are assigned by the Registerars and it can be anyone
            - but nameserver has the authority to manage the domain names
        - Cloudflare has many other options too, like, SSL certificate
            - Add your DNS to the cloudflare and do a quick scan
            - Add cloudflare's NameServer to your DNS providers NameServer
                - NameServer tells the provider who is managing your DNS
            - Now cloudflare will get the access to manage the domain name
        - A record - maps a name to one or more IP address when the IP are known and stable
        - CNAME record - maps a name to another name.

    - To enable SSL/TLS
        - go to the SSL/TLS tab in cloudflare
        - choose any of the automatic SSL/TLS record 
        - or Custom SSL/TLS
            - Strict(SSL/TLS) => enables encryption between cloudflare and your origin, regardless of the visitors request
            - Full (Strict) => Enable encryption end-to-end and enforce validation on origin certificates. Uses Cloudflare's Origin CA to generate certificates for your origin
            - Full => end-to-end. When origin server supports SSL certification but does not use a valid, publicly trusted certificate
            - Flexible => only between your user and cloudflare. Avoid browser security warnings, but all connections between cloudflare and your origin are made through HTTP.
            - Off ( not secure )

        - Now go to Edge Certificates and enable Automatic HTTPS rewrites (enables https)

    - In Brief: 
        - purchase the domain name
        - add this domain to the cloudflare
        - change the nameserver on the registerar and point it to cloudflare
        - Add DNS record - A devtinder.in IP
        - Enable SSL for website

# Learn By Yourself
    - How will you enable full SSL ( related to origin server )


# Sending automated email to the users (if someone receives a connection request)
    - Amazon SES ( Simple Email Service )
    - Go to IAM Dashboard and create new user, while creating new user attach the AmazonSESFull policies directly
    - Once the user has been created go the SES Dashboard

    - Create new Identity,
        - provide the domain name
        - Choose the Identity type, Easy DKIM, and signing length
        - Click create
        - Verify the domain name by adding the CNAME's under DKIM
            - AWS will verify the CNAME's
    
    - We can send the emails from the sandbox too but it limits many things, better request for the production access(transactional)

    - Get the creadentials of the user we had created (IAM Dashboard > Users > Select User > Security Credentials > Create Access key)
    - Select the use case(other), provide tag(optional), copy the aws ses access key and secret key and save it somewhere(save it to the .env of backend)



    - Now write somecode for enabling sending emails (checkout the aws ses node js documentations)

    - In Brief
        - Create a IAM user
        - Give access to AmazonSESFull
        - Amazon SES: Create an Identity
        - Verify your domain name
        - Verify an email address identity
        - Install AWS SDK -v3
        - Access Credentials should be created in IAM SecurityCredentials Tab
        - Use SES SDK for sending email at the backend
        - Make email more dynamic by passing more params to the run function