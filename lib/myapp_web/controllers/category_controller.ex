defmodule MyAppWeb.CategoryController do
  use MyAppWeb, :controller
  alias MyAppWeb.Response
  alias MyApp.Data

  @spec get_collection(map, map) :: any
  def get_collection(conn, _params) do
    output = get_categories()
    conn
    |> put_status(200)
    |> Response.json(output)
  end
  
  # cache categories end point because the data won't change after server start
  defp get_categories() do
    case Cachex.get(:myapp, "categories") do
      {:ok, data} -> data
      {:missing, _} ->
        data = Data.Category.get_categories()
        Cachex.set(:myapp, "categories", data)
        data
    end
  end
end
