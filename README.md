# Classic WoW Forums
World of Warcraft forums as they were in 2005.

I started working on this project to learn Elixir/Phoenix.
The goal was to make a forum that replicates
the World of Warcraft forums as they were back in 2005.
Currently the forums are fully functional and can be
seen at https://classicwowforums.com.

Made with:
- Elixir/Phoenix
- React/Mobx
- Postgres

## Config files
- all config files are in the config folder
- remove the .template from them
- create a new app in the battle.net api and add your keys

## Start the server
  - Install dependencies with `mix deps.get`
  - Create and migrate your database with `mix ecto.setup`
  - Start server with `mix phx.server`

## Build the client
- `cd client`
- `npm install`
- `npm run dev`

# Ecto

## Create new database table
- `mix ecto.gen.migration create_user`
- `mix ecto.migrate`

## Production

- `MIX_ENV=prod mix ecto.create`
- `MIX_ENV=prod mix ecto.migrate`
- `PORT=80 MIX_ENV=prod mix run priv/repo/seeds.exs`
- `PORT=80 MIX_ENV=prod mix phx.server`

## Postgres in docker container
```
docker run --name postgres1 -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
```

# Battlenet API
Battlenet required https for a redirect for authentication. I use caddy for https proxy during development.

Caddyfile
```
https://localhost {
        tls self_signed
        proxy / http://localhost:8080 {
                transparent
                websocket
        }
}
```
