defmodule MyApp.Data.Util do

  def map_changeset(changeset) do
    Enum.map(changeset.errors, fn {key, val} ->
      %{key => elem(val, 0)}
    end)
  end

  def process_insert_or_update({:error, changeset}), do: {:error, map_changeset(changeset)}
  def process_insert_or_update({:ok, data}), do: {:ok, data}

end
