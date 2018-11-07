use Mix.Config

# In this file, we keep production configuration that
# you'll likely want to automate and keep away from
# your version control system.
#
# You should document the content of this
# file or create a script for recreating it, since it's
# kept out of version control and might be hard to recover
# or recreate for your teammates (or yourself later on).
config :myapp, MyAppWeb.Endpoint,
  secret_key_base: "${SECRET_KEY_BASE}"

# Configure your database
config :myapp, MyApp.Repo,
  adapter: Ecto.Adapters.Postgres,
  hostname: "${DB_HOST}",
  username: "${DB_USER}",
  password: "${DB_PASS}",
  database: "myapp_prod",
  template: "template0",
  pool_size: 15
  
# Secret key. You can use `mix guardian.gen.secret` to get one
config :myapp, MyApp.Guardian,
      issuer: "myapp",
      secret_key: "${GUARDIAN_SECRET}"

config :myapp,
  bnet_client_id: "${BNET_CLIENT_ID}",
  bnet_client_secret: "${BNET_CLIENT_SECRET}",
  bnet_redirect_uri: "${BNET_REDIRECT_URI}",

# admin login credentials for site
admin_accounts: [
  %{
    "username" => "${ADMIN_USERNAME}",
    "password" => "${ADMIN_PASSWORD}",
    "character_name" => "${ADMIN_CHAR_NAME}",
    "character_avatar" => "${ADMIN_CHAR_AVATAR}",
    "permissions" => "${ADMIN_PERMISSIONS}"
  },
]
