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

    scope "/thread" do
      # authenticated routes
      pipe_through [:api_auth]
      post "/", ThreadController, :insert
      put "/", ThreadController, :update
    end

    scope "reply" do
      # authenticated routes
      pipe_through [:api_auth]
      post "/", ReplyController, :insert
    end

    scope "/category" do
      get "/", CategoryController, :get_collection
    end
  end
  
end
