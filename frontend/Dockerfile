# Base Image
FROM node:18-alpine As builder

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files, and attribute them to the node user
COPY --chown=node:node package*.json ./

# Install the dependencies to generate the ad-hoc package-lock.json file.
RUN npm ci --legacy-peer-deps

RUN npm install -g serve

# Copy the rest of the files
COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run build

# Optimise the node_modules directory
# RUN npm ci --legacy-peer-deps --only=production && npm cache clean --force
RUN npm ci --legacy-peer-deps --omit=dev

# # Use nginx as server
# FROM nginx:1.24.0-alpine

# # Copy assets from the builder
# COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# # Setting up SSL/TLS
# RUN apk update && apk add openssl && \
# 	mkdir -p /etc/nginx/ssl && \
# 	openssl req -x509 -days 365 -nodes -out /etc/nginx/ssl/inception.crt -keyout /etc/nginx/ssl/inception.key -subj "/C=FR/ST=IDF/L=Paris/O=42/CN=daftpong.com"

# # Copy nginx configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Set NODE_ENV environment variable
# ENV NODE_ENV production

# # Set the correct user
# # USER www-data

# CMD ["nginx", "-g", "daemon off;"]




# Set NODE_ENV environment variable
ENV NODE_ENV production
CMD [ "npx", "serve", "build" ]
