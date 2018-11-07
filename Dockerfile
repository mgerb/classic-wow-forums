FROM node:8.12-alpine

WORKDIR /home/client
ADD ./client .
RUN npm install
RUN npm run build


FROM elixir:1.7.3-alpine

WORKDIR /home

ADD . .
COPY --from=0 /home/priv/static /home/priv/static

RUN apk add alpine-sdk

ENV MIX_ENV=prod
ENV REPLACE_OS_VARS=true

RUN mix local.hex --force
RUN mix local.rebar --force
RUN mix deps.get
RUN mix deps.compile
RUN mix release --env=prod

FROM alpine:3.8

RUN apk update
RUN apk add bash openssl-dev

ENV REPLACE_OS_VARS=true

WORKDIR /home

COPY --from=1 /home/_build /home/_build
