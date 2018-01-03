defmodule MyAppWeb.CategoryController do
  use MyAppWeb, :controller
  alias MyAppWeb.Response
  alias MyApp.Data

  @spec get_collection(map, map) :: any
  def get_collection(conn, _params) do

    output = Data.Category.get_categories()

    conn
    |> put_status(200)
    |> Response.json(output)
  end
  
end
