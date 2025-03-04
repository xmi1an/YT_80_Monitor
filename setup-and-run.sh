#!/bin/bash

# Print commands and exit on errors
set -e
set -x

echo "Starting setup process..."

# Download and extract the project in current directory
echo "Downloading project..."
curl -L "https://github.com/xmi1an/YT_80_Monitor/archive/refs/heads/main.zip" -o YT_80_Monitor.zip
unzip YT_80_Monitor.zip

mv YT_80_Monitor-main/* . # Move all files from the project to the current directory
mv YT_80_Monitor-main/.* . 2>/dev/null || true # Move all hidden files from the project to the current directory

# remove YT_80_Monitor-main
rm -rf YT_80_Monitor-main
echo "Project downloaded and extracted."

# Update package repositories
# echo "Updating package repositories..."
# sudo apt-get update

# Install curl and unzip if not present
# echo "Installing required tools..."
# sudo apt-get install -y curl unzip

# Install Node.js and npm using NodeSource
echo "Installing Node.js and npm..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installations
echo "Verifying installations..."
node --version
npm --version

# Install project dependencies
echo "Installing project dependencies..."
npm install

# Start development server
echo "Starting development server..."
npm run dev

# curl -sSL https://raw.githubusercontent.com/xmi1an/YT_80_Monitor/main/setup-and-run.sh -o setup-and-run.sh && chmod +x setup-and-run.sh && ./setup-and-run.sh
