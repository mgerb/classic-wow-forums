# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :myapp,
  namespace: MyApp,
  ecto_repos: [MyApp.Repo]

# Configures the endpoint
config :myapp, MyAppWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "HiI7i2OfG+hhJ4oa8grLHQohaDq3aIgVO/G11RMtAnRBKrmPKl5YE4yZBk2zTqz/",
  render_errors: [view: MyAppWeb.ErrorView, accepts: ~w(json)],
  pubsub: [name: MyApp.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"

# user permissions for app - right now the read/write don't mean anything
config :myapp, MyApp.Guardian,
  permissions: %{
    user: [:read, :write],
    mod: [:read, :write],
    admin: [:read, :write],
  }
