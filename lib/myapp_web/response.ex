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

  # generatic function for converting data to response code
  @spec put_resp({:ok, any} | {:error, any}) :: {any, integer}
  def put_resp({:ok, data}), do: {data, 200}
  def put_resp({:error, error}), do: {error, 400}
end
