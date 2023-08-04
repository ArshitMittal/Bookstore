FROM node:lts-buster

# Set the working directory inside the container
EXPOSE 3000
WORKDIR /app

# Copy your project files into the container
# COPY package.json package-lock.json ./
COPY .   .

# Install project dependencies

# Expose the port your application listens on (if applicable)

# RUN npm install --force
# Command to start your application (replace "npm start" with your actual start command)
CMD ["node","src/index.js"]

