defmodule MyApp.Data.Thread do
  use Ecto.Schema
  import Ecto.Changeset
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
    timestamps()
  end

  defp insert_changeset(thread, params \\ %{}) do
    thread
    |> cast(params, [:title, :category_id, :content, :user_id])
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

  def insert_thread(params) do
    insert_changeset(%Data.Thread{}, params)
    |> Repo.insert
    |> Data.Util.process_insert_or_update
  end

  @spec user_update_thread(map) :: {:ok, map} | {:error, map}
  def user_update_thread(params) do
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
    |> Data.Util.process_insert_or_update
  end

end
