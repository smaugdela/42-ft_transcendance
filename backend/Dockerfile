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

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Copy the startup script
COPY --chown=node:node ./startup.sh ./startup.sh

# User should not be root for security reasons
USER node

# Start the server
CMD [ "sh", "startup.sh"]
