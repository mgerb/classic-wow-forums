defmodule MyApp.Data.Thread do
  use Ecto.Schema
  import Ecto.Query
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

  def changeset(thread, params \\ %{}) do
    thread
    |> cast(params, [:id, :title, :category_id, :content, :user_id, :view_count, :last_reply_id, :sticky, :locked, :edited])
    |> validate_required([:title, :category_id, :content, :user_id])
    |> foreign_key_constraint(:category_id)
  end

  def insert_thread(params) do
    changeset(%Data.Thread{}, params)
    |> Repo.insert
    |> Data.Util.process_insert_or_update
  end

  def update_thread(params) do
    Repo.get(Data.Thread, Map.get(params, "id"))
    |> process_update(params)
  end

  # TODO: check user permissions for sticky/locked
  defp process_update(thread, _params) when is_nil(thread), do: {:error, "Invalid thread"}
  defp process_update(thread, params) when not is_nil(thread) do
    changeset(thread, Map.take(params, ["content", "edited", "sticky", "locked"]))
    |> IO.inspect
    |> Repo.update
    |> Data.Util.process_insert_or_update
  end

end
