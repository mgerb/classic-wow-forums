defmodule MyAppWeb.Router do
  use MyAppWeb, :router
  alias MyApp.Guardian.AuthPipeline

  pipeline :api do
    plug :accepts, ["json"]
  end
  
  pipeline :api_auth do
    plug AuthPipeline.JSON
  end

  # Other scopes may use custom stacks.
  scope "/api", MyAppWeb do
    pipe_through [:api]

    scope "/battlenet" do
      get "/authorize", BattleNetController, :authorize

      pipe_through [:api_auth]
      get "/characters", BattleNetController, :characters
    end

    scope "/user" do
      # authenticated routes
      pipe_through [:api_auth]
      get "/", UserController, :index
    end
  end
  
end
