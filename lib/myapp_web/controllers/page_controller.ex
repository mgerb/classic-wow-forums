defmodule MyAppWeb.PageController do
  use MyAppWeb, :controller

  # serve index.html - cache the file after reading it to minimize IO
  @spec index(map, map) :: any
  def index(conn, _params) do

    # cache index.html if prod
    file = case Mix.env do
      :dev -> File.read!("./priv/static/index.html")
      _ -> 
        file = Cachex.get(:myapp, "index.html")
        |> get_file
    end

    conn
    |> html(file)
  end

  defp get_file({:ok, data}), do: data
  defp get_file({:missing, _}) do
    file = File.read!("./priv/static/index.html")
    Cachex.set(:myapp, "index.html", file)
    file
  end
  
end
