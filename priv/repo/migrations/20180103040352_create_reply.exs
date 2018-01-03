defmodule MyApp.Repo.Migrations.CreateReply do
  use Ecto.Migration

  def change do
    create table(:reply) do
      add :user_id, references(:user)
      add :thread_id, references(:thread)
      add :content, :string
      add :edited, :boolean
      add :quote, :boolean
      timestamps()
    end
  end
end
