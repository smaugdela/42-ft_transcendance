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

# Run the build command which creates the production bundle
# RUN npm run build

# Optimise the node_modules directory
# RUN npm ci --legacy-peer-deps --only=production && npm cache clean --force
# RUN npm ci --omit=dev

# Set NODE_ENV environment variable
ENV NODE_ENV production

CMD [ "npm", "run", "dev" ]
