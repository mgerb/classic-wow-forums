use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :myapp, MyAppWeb.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :myapp, MyApp.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "myapp_test",
  hostname: "localhost",
  template: "template0",
  pool: Ecto.Adapters.SQL.Sandbox

config :myapp, MyApp.Guardian,
      issuer: "myapp",
      secret_key: "secret"
