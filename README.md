# MyApp

## Generate a new app
`mix phx.new myapp --module MyApp --no-brunch --no-html --database postgres`

## Start the server

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Start Phoenix endpoint with `mix phx.server`

## Production
Ready to run in production? Please [check our deployment guides](http://www.phoenixframework.org/docs/deployment).

# Ecto

## Create table
`mix ecto.gen.migration create_user`
`mix ecto.migrate`

## Prod
Running app
`PORT=80 MIX_ENV=prod mix phx.server`

- when creating prod database
  - `MIX_ENV=prod mix ecto.create`
  - `MIX_ENV=prod mix ecto.migrate`

## Installing Elixir on C9
```
# for some reason C9 complains this file is missing when it tries to remove couchdb
sudo touch /etc/init.d/couchdb

sudo apt-get install inotify-tools
wget https://packages.erlang-solutions.com/erlang-solutions_1.0_all.deb && sudo dpkg -i erlang-solutions_1.0_all.deb
wget http://packages.erlang-solutions.com/ubuntu/erlang_solutions.asc
sudo apt-key add erlang_solutions.asc
sudo apt-get update
sudo apt-get install esl-erlang
sudo apt-get install elixir
mix local.hex
```
