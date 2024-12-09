FROM golang:1.23.4 as go

WORKDIR /app

COPY session ./session
COPY config  ./config
COPY util    ./util
COPY log     ./log
COPY *.mod   ./
COPY *.sum   ./
COPY *.go    ./

RUN CGO_ENABLED=0 go build

FROM alpine as main

WORKDIR /app

COPY --from=go /app/pufferphish ./

CMD ["./pufferphish"]
