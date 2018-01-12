defmodule MyApp.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:user) do
      add :battle_net_id, :integer
      add :battletag, :string
      add :permissions, :string
      add :character_guild, :string
      add :character_name, :string
      add :character_class, :string
      add :character_realm, :string
      add :character_avatar, :string
      timestamps()
    end

    create unique_index(:user, [:battle_net_id])
  end
end
