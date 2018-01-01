defmodule MyApp.BattleNet.Auth do
  alias MyApp.BattleNet.User
  alias MyApp.JWT

  def token_uri, do: "https://us.battle.net/oauth/token"

  def get_token(code) do
    client_id = Application.get_env(:myapp, :bnet_client_id)
    client_secret = Application.get_env(:myapp, :bnet_client_secret)
    redirect_uri = Application.get_env(:myapp, :bnet_redirect_uri)

    req_options = [hackney: [basic_auth: {client_id, client_secret}]]

    HTTPoison.request(:post, token_uri, get_req_body(code), [], req_options)
    |> parse_body
    |> parse_token
    |> validate_user
    |> generate_jwt
  end

  defp parse_body({:error, err}), do: {:error, err}
  defp parse_body({:ok, %HTTPoison.Response{body: body}}), do: Poison.decode(body)

  defp parse_token({:ok, %{"access_token" => token}}), do: {:ok, token}
  defp parse_token({:ok, %{"error" => err}}), do: {:error, err}
  defp parse_token({:error, err}), do: {:error, "Authentication error"}

  defp validate_user({:error, err}), do: {:error, err}
  defp validate_user({:ok, token}), do: User.get_user(token)

  defp generate_jwt({:error, err}), do: {:error, err}
  defp generate_jwt({:ok, user}) do
    case JWT.get_jwt(user, user) do
      {:ok, token} -> {:ok, Map.merge(user, %{"token" => token})}
      {:error, err} -> {:error, err}
    end
  end

  defp get_req_body(code) do
    redirect_uri = Application.get_env(:myapp, :bnet_redirect_uri)
    {:form, [
      grant_type: "authorization_code",
      scope: "wow.profile",
      code: code,
      redirect_uri: redirect_uri,
    ]}
  end

end

