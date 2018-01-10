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
    field :content, :string
    field :view_count, :integer, default: 0
    field :user_id, :integer # references :user
    field :last_reply_id, :integer
    field :sticky, :boolean, default: false
    field :locked, :boolean, default: false
    field :edited, :boolean, default: false
    field :reply_count, :integer, default: 0
    has_many :replies, Data.Reply
    has_one :user, Data.User, foreign_key: :id, references: :user_id
    has_one :last_reply, Data.User, foreign_key: :id, references: :last_reply_id
    timestamps()
  end

  defp insert_changeset(thread, params \\ %{}) do
    thread
    |> cast(params, [:title, :category_id, :content, :user_id, :last_reply_id])
    |> validate_required([:title, :category_id, :content, :user_id])
    |> foreign_key_constraint(:category_id)
    |> foreign_key_constraint(:user_id)
  end

  # TODO: allow mods to set sticky/locked on threads
  defp mod_update_changeset(thread, params \\ %{}) do
    thread
    |> cast(params, [:sticky, :locked])
  end

  # allow user to update content of their own thread
  defp user_update_changeset(thread, params \\ %{}) do
    thread
    |> cast(params, [:content])
    |> force_change(:edited, true) # set edited flag on update
    |> validate_required([:content])
  end

  def get(thread_id) do
    query = from t in Data.Thread,
      where: t.id == ^thread_id,
      preload: [:user, :last_reply, :replies]

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
        :locked,
        :last_reply_id,
        :edited,
        :content,
        :category_id,
        :title,
        :view_count,
        :reply_count,
        user: [:id, :battletag],
        last_reply: [:id, :battletag],
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
    params = Map.put(params, "last_reply_id", Map.get(params, "user_id"))
    insert_changeset(%Data.Thread{}, params)
    |> Repo.insert
    |> remove_associations
    |> Data.Util.process_insert_or_update
  end

  # update thread for user permission
  @spec user_update(map) :: {:ok, map} | {:error, map}
  def user_update(params) do
    id = Map.get(params, "id")
    user_id = Map.get(params, "user_id")

    if is_nil(id) || is_nil(user_id) do
      {:error, "Invalid thread"}
    else
      Repo.get_by(Data.Thread, %{id: id, user_id: user_id})
      |> process_user_update(params)
    end
  end

  # TODO: delete thread

  defp process_user_update(thread, _params) when is_nil(thread), do: {:error, "Invalid thread"}
  defp process_user_update(thread, params) when not is_nil(thread) do
    user_update_changeset(thread, params)
    |> Repo.update
    |> remove_associations
    |> Data.Util.process_insert_or_update
  end

  defp remove_associations({err, data}), do: {err, Map.drop(data, [:user, :replies, :last_reply])}

end
