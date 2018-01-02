use ExGuard.Config

guard("dialyzer")
|> command("mix dialyzer")
|> watch(~r{\.(erl|ex|exs|eex|xrl|yrl)\z}i)
|> ignore(~r{deps})
|> notification(:off)
