defmodule MyApp.Guardian.Auth.Pipeline.User do
  use Guardian.Plug.Pipeline, otp_app: :myapp,
                              module: MyApp.Guardian,
                              error_handler: MyApp.Auth.ErrorHandler

  plug Guardian.Plug.VerifyHeader, realm: "Bearer"
  plug Guardian.Permissions.Bitwise, one_of: [
    %{user: [:read, :write]},
    %{mod: [:read, :write]},
    %{admin: [:read, :write]},
  ]
  plug Guardian.Plug.EnsureAuthenticated
  plug Guardian.Plug.LoadResource, allow_blank: true
end

defmodule MyApp.Guardian.Auth.Pipeline.Mod do
  use Guardian.Plug.Pipeline, otp_app: :myapp,
                              module: MyApp.Guardian,
                              error_handler: MyApp.Auth.ErrorHandler

  plug Guardian.Plug.VerifyHeader, realm: "Bearer"
  plug Guardian.Permissions.Bitwise, one_of: [
    %{mod: [:read, :write]},
    %{admin: [:read, :write]},
  ]
  plug Guardian.Plug.EnsureAuthenticated
  plug Guardian.Plug.LoadResource, allow_blank: true
end

defmodule MyApp.Guardian.Auth.Pipeline.Admin do
  use Guardian.Plug.Pipeline, otp_app: :myapp,
                              module: MyApp.Guardian,
                              error_handler: MyApp.Auth.ErrorHandler

  plug Guardian.Plug.VerifyHeader, realm: "Bearer"
  plug Guardian.Permissions.Bitwise, one_of: [%{admin: [:read, :write]}]
  plug Guardian.Plug.EnsureAuthenticated
  plug Guardian.Plug.LoadResource, allow_blank: true
end
