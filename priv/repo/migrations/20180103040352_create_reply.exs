defmodule MyApp.Repo.Migrations.CreateReply do
  use Ecto.Migration

  def change do
    create table(:reply) do
      add :user_id, references(:user)
      add :thread_id, references(:thread)
      add :content, :string, size: 2000
      add :edited, :boolean
      add :quote_id, :integer
      timestamps()
    end
  end
end
