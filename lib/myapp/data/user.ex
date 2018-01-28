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
    field :character_guild, :string
    field :character_name, :string
    field :character_class, :string
    field :character_realm, :string
    field :character_avatar, :string

    # for admin purposes
    field :username, :string
    field :password, :string
    timestamps(type: :utc_datetime)
  end

  defp changeset(user, params \\ %{}) do
    user
    |> cast(params, [:battle_net_id, :battletag])
    |> validate_required([:battle_net_id, :battletag])
    |> unique_constraint(:battle_net_id)
  end

  defp update_char_changeset(user, params \\ %{}) do
    user
    |> cast(params, [:character_guild, :character_name, :character_class, :character_realm, :character_avatar])
    |> validate_required([:character_name, :character_class, :character_realm, :character_avatar])
  end

  def update_character(params) do
    {:ok, data} = Repo.transaction(fn ->
      user = Repo.get(__MODULE__, Map.get(params, "id"))
      # remove columns from data because we need to update all of them
      |> Map.drop([:character_realm, :character_name, :character_guild, :character_class, :character_avatar])
      output = user
      |> update_char_changeset(params)
      |> Repo.update
      |> Data.Util.process_insert_or_update
    end)
    data
  end

  @spec get_user(integer) :: nil | map
  defp get_user(battle_net_id) do
    query = from u in "user",
      where: u.battle_net_id == ^battle_net_id,
      select: [:id, :permissions, :battle_net_id, :battletag, :character_guild, :character_name, :character_class, :character_realm, :character_avatar]
    Repo.one(query)
  end

  # insert user info in database - if not exists - update battletag if it has changed
  @spec upsert_user(%{"battle_net_id": integer, "battletag": String.t, "access_token": String.t} | tuple) :: {:ok, map} | {:error, any}
  def upsert_user(params) when is_map(params) do
    # check for current user in database
    user = get_user(Map.get(params, "battle_net_id"))

    output = cond do
      is_nil(user) ->
        insert_battlenet_user(params)
      true ->
        if Map.get(user, :battletag) != Map.get(params, "battletag") do
          update_battletag(user, params)
        else
          {:ok, user}
        end
    end

    output
    |> add_extra_params(params)
  end
  def upsert_user({:ok, params}), do: upsert_user(params)
  def upsert_user({:error, error}), do: {:error, error}

  # need to add token back to map because we don't store it in the database
  defp add_extra_params({:error, error}, _), do: {:error, error}
  defp add_extra_params({:ok, user}, params) do
    {:ok, Map.merge(user, params)}
  end

  defp insert_battlenet_user(params) do
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

  def insert_admin_user(params) do
    params = params
    |> Map.put("password", Comeonin.Argon2.hashpwsalt(Map.get(params, "password")))

    %Data.User{}
    |> cast(params, [:username, :password, :permissions, :character_name, :character_avatar])
    |> Repo.insert
  end

  def login(params) do
    user = Repo.get_by(Data.User, username: Map.get(params, "username"))

    if user do
      case Comeonin.Argon2.checkpw(Map.get(params, "password"), user.password) do
        false -> {:error, "invalid login"}
        _ ->
          user = user
          |> Map.from_struct
          |> Map.drop([:password, :__meta__])
          {:ok, user}
      end
    else
      {:error, "invalid login"}
    end
  end

end
