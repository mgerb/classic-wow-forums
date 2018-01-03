defmodule MyApp.Data.Category do
  use Ecto.Schema
  import Ecto.Query
  import Ecto.Changeset
  alias MyApp.Repo
  alias MyApp.Data

  @derive {Poison.Encoder, except: [:__meta__]}
  schema "category" do
    field :category, :string
    field :title, :string
  end

  def changeset(category, params \\ %{}) do
    category
    |> cast(params, [:category, :title])
    |> validate_required([:category, :title])
  end

  def get_categories() do
    Repo.all(Data.Category)
  end

end
