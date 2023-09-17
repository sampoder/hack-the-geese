# Use the offical Golang image to build the app: https://hub.docker.com/_/golang
FROM golang:1.17 as builder

# Copy code to the image
WORKDIR /go/src/websockets
COPY . .

# Build the app

RUN CGO_ENABLED=0 GOOS=linux go run github.com/steebchen/prisma-client-go db push

RUN CGO_ENABLED=0 GOOS=linux go build -v -o app

CMD ["./app"]