defmodule MyAppWeb.Response do

  # error handling based on http status
  def json(conn, data) do

    output = cond do
      conn.status && conn.status >= 400 -> 
        %{
          error: %{
            status: conn.status,
            message: data,
          }
        }
      
       true -> %{
         data: data
       }
    end

    Phoenix.Controller.json(conn, output)
  end
end
