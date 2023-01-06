FROM node:19.4.0-alpine
WORKDIR /app
RUN apk update && apk upgrade && \
	apk add --no-cache bash git
COPY package.json .
RUN yarn
COPY . .
RUN mkdir -p tmp
ENTRYPOINT yarn start