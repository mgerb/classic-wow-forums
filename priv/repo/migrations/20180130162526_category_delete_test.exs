defmodule MyApp.Repo.Migrations.CategoryDeleteTest do
  use Ecto.Migration
  import Ecto.Query  

  # delete the test category I forgot in
  def change do
    from(c in "category", where: c.title == "Test")
    |> MyApp.Repo.delete_all
  end
end
