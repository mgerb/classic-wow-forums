defmodule MyApp.Data.Reply do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query
  alias MyApp.Repo
  alias MyApp.Data

  @derive {Poison.Encoder, except: [:__meta__]}
  schema "reply" do
    field :user_id, :integer # references :user
    field :thread_id, :integer # references :thread
    field :content, :string
    field :edited, :boolean, default: false
    field :quote_id, :integer
    field :hidden, :boolean, default: false
    has_one :user, Data.User, foreign_key: :id, references: :user_id
    timestamps(type: :utc_datetime)
  end

  defp insert_changeset(reply, params \\ %{}) do
    reply
    |> cast(params, [:user_id, :thread_id, :content, :quote_id])
    |> validate_required([:user_id, :thread_id, :content])
    |> foreign_key_constraint(:user_id)
    |> foreign_key_constraint(:thread_id)
  end

  # allow user to update reply
  defp user_update_changeset(reply, params \\ %{}) do
    reply
    |> cast(params, [:content])
    |> force_change(:edited, true) # set edited flag on update
    |> validate_required([:content])
  end

  @spec insert(map) :: {:ok, map} | {:error, map}
  def insert(params) do
    {:ok, data} = insert_changeset(%Data.Reply{}, params)
    |> Repo.insert
    |> Data.Util.process_insert_or_update
    |> update_thread_new_reply
    {:ok, Map.drop(data, [:user])} # drop user because we can't encode it if it's not preloaded
  end

  defp update_thread_new_reply({:error, error}), do: {:error, error}
  defp update_thread_new_reply({:ok, reply}) do
    thread_id = Map.get(reply, :thread_id)
    user_id = Map.get(reply, :user_id)
    query = from t in Data.Thread, where: t.id == ^thread_id,
      update: [set: [last_reply_id: ^user_id, updated_at: ^DateTime.utc_now], inc: [reply_count: 1]]

    case Repo.update_all(query, []) do
      nil -> {:error, "update thread error"}
      {1, _} -> {:ok, reply}
    end
  end

  @spec user_update(map) :: {:ok, String.t} | {:error, String.t}
  def user_update(params) do
    id = Map.get(params, "id")
    user_id = Map.get(params, "user_id")
    content = Map.get(params, "content")

    if is_nil(id) || is_nil(user_id) || is_nil(content) do
      {:error, "Invalid reply"}
    else
      query = from r in Data.Reply,
        where: r.id == ^id and r.user_id == ^user_id,
        update: [set: [content: ^content, edited: true]]

      case Repo.update_all(query, []) do
        nil -> {:error, "update reply error"}
        {1, _} -> {:ok, "ok"}
      end
    end
  end

end
