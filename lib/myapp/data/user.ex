defmodule MyApp.Data.User do
  use Ecto.Schema
  import Ecto.Query
  import Ecto.Changeset
  alias MyApp.Repo
  alias MyApp.Data

  @derive {Poison.Encoder, except: [:__meta__, :__struct__]}
  schema "user" do
    field :battle_net_id, :integer
    field :battletag, :string
    field :permissions, :string, default: "user" # admin, mod, user

    timestamps()
  end

  def changeset(user, params \\ %{}) do
    user
    |> cast(params, [:battle_net_id, :battletag])
    |> validate_required([:battle_net_id, :battletag])
    |> unique_constraint(:battle_net_id)
  end

  @spec get_user(integer) :: nil | map
  defp get_user(battle_net_id) do
    query = from u in "user",
      where: u.battle_net_id == ^battle_net_id,
      select: [:id, :permissions, :battle_net_id, :battletag]
    Repo.one(query)
  end

  # insert user info in database - if not exists - update battletag if it has changed
  @spec upsert_user(%{"battle_net_id": integer, "battletag": String.t} | tuple) :: {:ok, map} | {:error, any}
  def upsert_user(params) when is_map(params) do
    # check for current user in database
    case get_user(Map.get(params, "battle_net_id")) do  
      nil -> insert_user(params)
      user ->
        # update user if battletag has changed
        if Map.get(user, :battletag) != Map.get(params, "battletag") do
          update_battletag(user, params)
        else
          {:ok, user}
        end
    end
    |> add_access_token(Map.get(params, "access_token"))
  end
  def upsert_user({:ok, params}), do: upsert_user(params)
  def upsert_user({:error, error}), do: {:error, error}

  # need to add token back to map because we don't store it in the database
  defp add_access_token({:error, error}, _), do: {:error, error}
  defp add_access_token({:ok, user}, access_token) do
    {:ok, Map.merge(user, %{access_token: access_token})}
  end

  defp insert_user(params) do
    changeset(%Data.User{}, params)
    |> Repo.insert
    |> Data.Util.process_insert_or_update
    |> filter_values
  end

  # it's possible for a user's battle tag to change - if so update it
  defp update_battletag(user, params) do
    changeset(Map.merge(%Data.User{}, user), %{battletag: Map.get(params, "battletag")})
    |> Repo.update
    |> Data.Util.process_insert_or_update
    |> filter_values
  end

  # take certain values after insertion
  defp filter_values({:error, error}), do: {:error, error}
  defp filter_values({:ok, user}), do: {:ok, Map.take(user, [:id, :permissions, :battle_net_id, :battletag])}

end
