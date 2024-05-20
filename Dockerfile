# Use an official Ubuntu runtime as a parent image
FROM ubuntu:20.04

# Prevent prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update
RUN apt-get install -y curl software-properties-common
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs
RUN node -v && npm -v
RUN 
RUN apt-get install -y \
  git \
  wget \
  gnupg
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list'
RUN apt-get update
RUN apt-get install -y google-chrome-stable

EXPOSE 9876

# Define the command to run the tests
CMD ["tail", "-f", "/dev/null"]
