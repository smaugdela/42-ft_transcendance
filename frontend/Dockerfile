# Base Image
FROM node:18-alpine As builder

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files, and attribute them to the node user
COPY --chown=node:node package*.json ./

# Install the dependencies to generate the ad-hoc package-lock.json file.
RUN npm ci

# Copy the rest of the files
COPY --chown=node:node . .

COPY .env .env

# Run the build command which creates the production bundle
RUN npm run build

# Use nginx as server
FROM nginx:1.24.0-alpine

# Copy assets from the builder
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Make sure assets are readable by nginx
RUN chmod -R 755 /usr/share/nginx/html

# Setting up SSL/TLS
# RUN apk update && apk add openssl && \
# 	mkdir -p /etc/nginx/ssl && \
# 	openssl req -x509 -days 365 -nodes -out /etc/nginx/ssl/inception.crt -keyout /etc/nginx/ssl/inception.key -subj "/C=FR/ST=IDF/L=Paris/O=42/CN=daftpong.com"

# COPY ./security/localhost.pem /etc/nginx/ssl/localhost.pem
# COPY ./security/localhost-key.pem /etc/nginx/ssl/localhost-key.pem
COPY security/cert.pem /etc/nginx/ssl/cert.pem
COPY security/cert.key /etc/nginx/ssl/cert.key

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set NODE_ENV environment variable
ENV NODE_ENV production

CMD ["nginx", "-g", "daemon off;"]
