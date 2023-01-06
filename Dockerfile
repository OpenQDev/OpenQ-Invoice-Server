FROM node:18.13.0-alpine
WORKDIR /app
RUN apk update && apk upgrade && \
	apk add --no-cache bash git
COPY package.json .
RUN yarn
COPY . .
RUN mkdir -p tmp
ENTRYPOINT yarn start