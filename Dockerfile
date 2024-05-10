# Use the official Node.js 14 image as a base.
FROM node:20.13.1-bullseye

# Perform an update on the package list inside the container and install some dependencies.
RUN apt-get update
RUN apt-get install -y libaa-bin

# Set the working directory in the container to /usr/src/app.
WORKDIR /usr/src/app

# Copy the package.json to the container in the working directory.
COPY package.json ./

# Install the node dependencies listed in the package.json.
RUN npm install

# Copy the rest of the application files and folders to the container. Whatever is in the .dockerignore file WILL NOT be copied.
COPY . .

# Expose the container port 8000.
EXPOSE 8000

# Final command to run the Node.js application.
CMD ["node", "server.js"]
