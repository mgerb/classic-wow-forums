defmodule MyApp.JWT do
  alias MyApp.Guardian
  
  # ~1 year
  defp tokenTTL(), do: {52, :weeks}

  @spec add_jwt(map | {atom, any}) :: {:ok, map} | {:error, String.t}
  def add_jwt(user) when is_map(user) do
    case Guardian.encode_and_sign(user, user, ttl: tokenTTL()) do
      {:ok, token, _claims} -> {:ok, Map.merge(user, %{token: token})}
      {:error, error} -> {:error, error}
    end
  end

  def add_jwt({:ok, user}), do: add_jwt(user)
  def add_jwt({:error, error}), do: {:error, error}

end
