defmodule MyAppWeb.Router do
  use MyAppWeb, :router
  alias MyApp.Guardian.Auth

  pipeline :api do
    plug :accepts, ["json"]
  end
  
  pipeline :user_auth do
    plug Auth.Pipeline.User
  end

  pipeline :mod_auth do
    plug Auth.Pipeline.Mod
  end

  pipeline :admin_auth do
    plug Auth.Pipeline.Admin
  end

  # Other scopes may use custom stacks.
  scope "/api", MyAppWeb do
    pipe_through [:api]

    scope "/battlenet" do
      post "/authorize", BattleNetController, :authorize

      pipe_through [:user_auth]
      get "/characters", BattleNetController, :characters
    end

    scope "/user" do
      # authenticated routes
      pipe_through [:user_auth]
      get "/", UserController, :index
    end

    scope "/thread" do
      get "/", ThreadController, :get_collection
      get "/:id", ThreadController, :get

      # authenticated routes
      pipe_through [:user_auth]
      post "/", ThreadController, :insert
      put "/", ThreadController, :update
    end

    scope "/reply" do
      # authenticated routes
      pipe_through [:user_auth]
      post "/", ReplyController, :insert
      put "/", ReplyController, :update
    end

    scope "/category" do
      get "/", CategoryController, :get_collection
    end
  end
  
  # catch all for serving single page web app
  scope "/*all", MyAppWeb do
    get "/", PageController, :index
  end

end
