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
    field :quote, :boolean, default: false
    timestamps()
  end

  defp insert_changeset(reply, params \\ %{}) do
    reply
    |> cast(params, [:user_id, :thread_id, :content, :quote])
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
    insert_changeset(%Data.Reply{}, params)
    |> Repo.insert
    |> Data.Util.process_insert_or_update
    |> update_thread_new_reply
  end

  defp update_thread_new_reply({:error, error}), do: {:error, error}
  defp update_thread_new_reply({:ok, reply}) do
    thread_id = Map.get(reply, :thread_id)
    user_id = Map.get(reply, :user_id)
    query = from t in Data.Thread, where: t.id == ^thread_id,
      update: [set: [last_reply_id: ^user_id, updated_at: ^DateTime.utc_now], inc: [reply_count: 1]]

    case Repo.update_all(query, []) do
      nil -> {:error, "update thread error"}
      _ -> {:ok, reply}
    end
  end

  @spec user_update(map) :: {:ok, map} | {:error, map}
  def user_update(params) do
    id = Map.get(params, "id")
    user_id = Map.get(params, "user_id")

    if is_nil(id) || is_nil(user_id) do
      {:error, "Invalid reply"}
    else
      Repo.get_by(Data.Reply, %{id: id, user_id: user_id})
      |> process_user_update(params)
    end
  end

  defp process_user_update(reply, _params) when is_nil(reply), do: {:error, "Invalid reply"}
  defp process_user_update(reply, params) when not is_nil(reply) do
    user_update_changeset(reply, params)
    |> Repo.update
    |> Data.Util.process_insert_or_update
  end

end
