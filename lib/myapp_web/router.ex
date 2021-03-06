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

    get "/config", ConfigController, :get_config

    scope "/user" do
      post "/authorize", UserController, :authorize
      post "/login", UserController, :login

      pipe_through [:user_auth]
      get "/characters", UserController, :characters
      put "/characters", UserController, :update_selected_character
    end

    scope "/thread" do
      get "/", ThreadController, :get_collection
      get "/:id", ThreadController, :get

      # authenticated routes
      pipe_through [:user_auth]
      post "/", ThreadController, :insert

      pipe_through [:mod_auth]
      put "/mod", ThreadController, :mod_update
    end

    scope "/reply" do
      # authenticated routes
      pipe_through [:user_auth]
      post "/", ReplyController, :insert
      put "/", ReplyController, :update

      pipe_through [:mod_auth]
      put "/mod", ReplyController, :mod_update
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
