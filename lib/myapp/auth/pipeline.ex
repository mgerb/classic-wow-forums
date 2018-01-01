defmodule MyApp.Guardian.AuthPipeline.JSON do
  use Guardian.Plug.Pipeline, otp_app: :MyApp,
                              module: MyApp.Guardian,
                              error_handler: MyApp.Auth.ErrorHandler

  plug Guardian.Plug.VerifyHeader, realm: "Bearer"
  plug Guardian.Plug.EnsureAuthenticated
  plug Guardian.Plug.LoadResource, allow_blank: true
end
