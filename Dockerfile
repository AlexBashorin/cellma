FROM golang:alpine AS builder
WORKDIR /app

COPY go.mod /app
RUN go mod download

COPY cmd /app/cmd
COPY cmd/static /app/cmd/static
COPY internal /app/internal

RUN go build -o /app/cellma ./cmd/main.go

FROM alpine
WORKDIR /app
COPY --from=builder /app /app
CMD ["/app/cellma"]