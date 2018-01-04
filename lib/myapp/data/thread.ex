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

  def insert_changeset(thread, params \\ %{}) do
    thread
    |> cast(params, [:title, :category_id, :content, :user_id])
    |> validate_required([:title, :category_id, :content, :user_id])
    |> foreign_key_constraint(:category_id)
    |> foreign_key_constraint(:user_id)
  end

  def update_changeset(thread, params \\ %{}) do
    thread
    |> cast(params, [:content, :user_id, :sticky, :locked])
    |> force_change(:edited, true) # set edited flag on update
    |> validate_required([:content, :user_id])
    |> foreign_key_constraint(:category_id)
    |> foreign_key_constraint(:user_id)
  end

  def insert_thread(params) do
    insert_changeset(%Data.Thread{}, params)
    |> Repo.insert
    |> Data.Util.process_insert_or_update
  end

  def update_thread(params) do
    id = Map.get(params, "id")
    if id == nil do
      {:error, "Invalid thread"}
    else
      Repo.get(Data.Thread, id)
      |> process_update(params)
    end
  end

  # TODO: delete thread

  # TODO: check user permissions for sticky/locked
  defp process_update(thread, _params) when is_nil(thread), do: {:error, "Invalid thread"}
  defp process_update(thread, params) when not is_nil(thread) do
    update_changeset(thread, params)
    |> Repo.update
    |> Data.Util.process_insert_or_update
  end

end
