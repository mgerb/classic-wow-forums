defmodule MyApp.Repo.Migrations.CreateCategory do
  use Ecto.Migration

  def change do
    create table(:category) do
      add :category, :string
      add :title, :string
    end

    create unique_index(:category, [:category, :title])
  end

end
