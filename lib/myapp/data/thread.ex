defmodule MyApp.Data.Thread do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query
  alias MyApp.Repo
  alias MyApp.Data

  @derive {Poison.Encoder, except: [:__meta__]}
  schema "thread" do
    field :title, :string
    field :category_id, :integer # references :category
    field :view_count, :integer, default: 0
    field :user_id, :integer # references :user
    field :last_reply_id, :integer
    field :reply_count, :integer, default: 0
    field :hidden, :boolean, default: false
    field :locked, :boolean, default: false
    field :sticky, :boolean, default: false
    has_many :replies, Data.Reply
    has_one :user, Data.User, foreign_key: :id, references: :user_id
    has_one :last_reply, Data.User, foreign_key: :id, references: :last_reply_id
    timestamps(type: :utc_datetime)
  end

  defp insert_changeset(thread, params \\ %{}) do
    thread
    |> cast(params, [:title, :category_id, :user_id, :last_reply_id])
    |> validate_required([:title, :category_id, :user_id])
    |> foreign_key_constraint(:category_id)
    |> foreign_key_constraint(:user_id)
  end

  @spec mod_update(map) :: {:ok, any}
  def mod_update(params) do
    Repo.transaction(fn ->
      reply = Repo.get_by(Data.Thread, %{ id: Map.get(params, "id")})

      reply
      |> cast(params, [:hidden, :sticky, :locked])
      |> Repo.update
    end)
  end

  def get(thread_id) do
    query = from t in Data.Thread,
      where: t.id == ^thread_id,
      preload: [:user, :last_reply, replies: :user]

    Repo.one(query)
    |> process_get
  end

  def get_collection(category_id) do
    query = from t in Data.Thread,
      select: map(t, [
        :id,
        :user_id,
        :updated_at,
        :inserted_at,
        :sticky,
        :hidden,
        :locked,
        :last_reply_id,
        :category_id,
        :title,
        :view_count,
        :reply_count,
        user: [:id, :battletag, :character_guild, :character_name, :character_class, :character_realm, :character_avatar, :permissions],
        last_reply: [:id, :battletag, :character_guild, :character_name, :character_class, :character_realm, :character_avatar, :permissions],
      ]),
      where: [category_id: ^category_id],
      preload: [:user, :last_reply]

    if category_id != nil do
      Repo.all(query)
      |> process_get
    else
      {:error, "category_id required"}
    end
  end

  defp process_get(data) when is_nil(data), do: {:error, "Not found"}
  defp process_get(data) when not is_nil(data), do: {:ok, data}

  @spec insert(map) :: {:ok, map} | {:error, map}
  def insert(params) do
    {_, data} = Repo.transaction(fn ->
      params = Map.put(params, "last_reply_id", Map.get(params, "user_id"))
      {:ok, thread} = insert_changeset(%Data.Thread{}, params)
      |> Repo.insert

      {:ok, data} = Repo.insert(%Data.Reply{
          thread_id: Map.get(thread, :id),
          content: Map.get(params, "content"),
          user_id: Map.get(params, "user_id")
        })
      # return the new thread we inserted - drop associations because we don't load them
      {:ok, Map.drop(thread, [:last_reply, :replies, :user])}
    end)
    data
  end

  # this doesn't update the 'updated_at' field which is what we want
  def update_view_count(thread_id) do
    query = from t in Data.Thread,
      update: [inc: [view_count: 1]],
      where: t.id == ^thread_id
    Repo.update_all(query, [])
  end

  # TODO: delete thread

  defp remove_associations({err, data}), do: {err, Map.drop(data, [:user, :replies, :last_reply])}

end
