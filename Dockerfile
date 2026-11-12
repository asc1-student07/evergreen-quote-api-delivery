# Dockerfile - package the Evergreen Quote API into a container image (provided).

# Start from an official, small Node base image (Alpine = tiny Linux).
FROM node:22-alpine

# Set the working directory inside the image.
WORKDIR /app

# Copy the package files first so the dependency layer is cached independently
# of source changes, then install exactly what the lock file says.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the rest of the application source into the image.
COPY . .

# Document the port the app listens on.
EXPOSE 3000

# The command that runs when the container starts.
CMD ["node", "src/index.js"]
