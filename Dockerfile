# Step 1: Use an official Node.js image as the base image for building
FROM node:18 AS build

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Step 4: Install the project dependencies
RUN npm install

# Step 5: Copy the rest of your Angular project files to the container
COPY . .

# Step 6: Build the Angular project for production
RUN npm run build --prod

# Step 7: Use Nginx to serve the application in production
FROM nginx:alpine

# Step 8: Copy the Angular build output from the build stage to Nginx's public directory
COPY --from=build /app/dist/expense-tracker /usr/share/nginx/html

# Step 9: Expose port 80 to allow access to the app
EXPOSE 80

# Step 10: Start Nginx to serve the Angular app
CMD ["nginx", "-g", "daemon off;"]

# === OR in other way === #
# FROM node:18.13.0 as build

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# RUN npm install -g @angular/cli

# COPY . .

# RUN ng build --configuration=production

# FROM nginx:latest

# COPY --from=build app/dist/aftas-angular /usr/share/nginx/html

# EXPOSE 80