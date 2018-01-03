defmodule MyApp.Data.Reply do
  use Ecto.Schema
  import Ecto.Query
  import Ecto.Changeset
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

  def changeset(reply, params \\ %{}) do
    reply
    |> cast(params, [:user_id, :thread_id, :content, :edited, :quote])
    |> validate_required([:user_id, :thread_id, :content])
    |> foreign_key_constraint(:user_id)
    |> foreign_key_constraint(:thread_id)
  end

  def insert_reply(params) do
    changeset(%Data.Reply{}, params)
    |> Repo.insert
    |> Data.Util.process_insert_or_update
  end

end
