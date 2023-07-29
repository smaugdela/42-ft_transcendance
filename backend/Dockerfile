# Base image (alpine is lighter and more secure)
FROM node:18-alpine As build

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files, and attribute them to the node user
COPY --chown=node:node package*.json ./

# # Install the dependencies to generate the ad-hoc package-lock.json file.
RUN npm ci

# Copy the rest of the files
COPY --chown=node:node . .

# Copy the env file reserved for docker as .env
COPY --chown=node:node .env.docker .env

# Initialise prisma
RUN npx prisma generate

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# # Install the dependencies to generate the ad-hoc package-lock.json file.
# RUN npm i

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm ci --only=production && npm cache clean --force

# User should not be root for security reasons
USER node

# Start the server
CMD [ "node", "dist/main.js" ]
