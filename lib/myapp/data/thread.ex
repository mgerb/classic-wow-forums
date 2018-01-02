defmodule MyApp.Data.Thread do
  use Ecto.Schema
  import Ecto.Query
  import Ecto.Changeset
  alias MyApp.Repo
  alias MyApp.Data

  @derive {Poison.Encoder, except: [:__meta__]}
  schema "thread" do
    field :title, :string
    field :content, :string
    field :view_count, :integer
    field :user_id, :integer
    field :last_reply_id, :integer
    field :sticky, :boolean, default: false
    field :locked, :boolean, default: false

    belongs_to :user, Data.User, define_field: false
    timestamps()
  end

  def changeset(thread, params \\ %{}) do
    thread
    |> cast(params, [:title, :content, :user_id, :view_count, :last_reply_id, :sticky, :locked])
    |> validate_required([:title, :content, :user_id])
  end

end
