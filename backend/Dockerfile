# Base image (alpine is lighter and more secure)
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files, and attribute them to the node user
COPY --chown=node:node package*.json ./

# Install the dependencies to generate the ad-hoc package-lock.json file.
RUN npm ci

# Copy the rest of the files
COPY --chown=node:node . .

# Initialise prisma
RUN npx prisma generate

# Run the build command which creates the production bundle
RUN npm run build

# Setting up SSL/TLS
RUN apk update && apk add openssl && \
	cd security && \
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256

# Make prisma schema available to node user
RUN	chown -R node:node node_modules/.prisma && \
	chown node:node ./security/*

# Copy the startup script
COPY --chown=node:node ./startup.sh ./startup.sh

# Set NODE_ENV environment variable
ENV NODE_ENV production

# User should not be root for security reasons
USER node

# Start the server
CMD [ "sh", "startup.sh"]
