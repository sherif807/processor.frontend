# Use a Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the Next.js app
RUN npm run build

# Verify if the `.next` folder is created
RUN ls -la .next || echo ".next folder not found"

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js app in development mode
CMD ["npm", "run", "dev"]
