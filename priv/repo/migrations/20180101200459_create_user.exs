defmodule MyApp.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:user) do
      add :battle_net_id, :integer
      add :battletag, :string

      timestamps()
    end

    create unique_index(:user, [:battle_net_id])
  end
end
