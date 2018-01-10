defmodule MyApp.Repo.Migrations.ThreadReplyCount do
  use Ecto.Migration

  def change do
    alter table(:thread) do
      add :reply_count, :integer
    end
  end
end
