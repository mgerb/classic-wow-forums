# Classic WoW Forums

## Generate a new app
`mix phx.new myapp --module MyApp --no-brunch --no-html --database postgres`

## Start the server

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Start Phoenix endpoint with `mix phx.server`

## Production
Ready to run in production? Please [check our deployment guides](http://www.phoenixframework.org/docs/deployment).

# Ecto

## Create new database table
- `mix ecto.gen.migration create_user`
- `mix ecto.migrate`

## Production

- `MIX_ENV=prod mix ecto.create`
- `MIX_ENV=prod mix ecto.migrate`
- `PORT=80 MIX_ENV=prod mix run priv/repo/seeds.exs`
- `PORT=80 MIX_ENV=prod mix phx.server`

# Installing Elixir on Centos 7

Update the system
```
sudo yum install epel-release
sudo yum update
sudo reboot
```

Install Erlang
```
wget https://packages.erlang-solutions.com/erlang/esl-erlang/FLAVOUR_1_general/esl-erlang_20.2.2-1~centos~7_amd64.rpm
sudo rpm -Uvh ./esl-erlang_20.2.2-1~centos~7_amd64.rpm
sudo yum install erlang
```

Install Elixir
```
mkdir -p /usr/bin/elixir
sudo wget https://github.com/elixir-lang/elixir/releases/download/v1.5.2/Precompiled.zip
sudo yum install unzip
sudo unzip Precompiled.zip
export PATH=$PATH:/usr/bin/elixir/bin
```

Might have to install GCC - needed for comonin/argon2
```
yum group install "Development Tools"
```

# Installing Elixir on C9
```
# for some reason C9 complains this file is missing when it tries to remove couchdb
sudo touch /etc/init.d/couchdb

sudo apt-get install inotify-tools
wget https://packages.erlang-solutions.com/erlang-solutions_1.0_all.deb && sudo dpkg -i erlang-solutions_1.0_all.deb
wget http://packages.erlang-solutions.com/ubuntu/erlang_solutions.asc
sudo apt-key add erlang_solutions.asc
sudo apt-get update
sudo apt-get install esl-erlang
sudo apt-get install elixir
mix local.hex
```

# Using Dialyzer for type checking
- [Setup with Phoenix](https://github.com/jeremyjh/dialyxir/wiki/Phoenix-Dialyxir-Quickstart)
- Uses [ExGuard](https://github.com/slashmili/ex_guard) to run every time a file is changed.
- Run `mix guard` to start watching files.
- Check out `.exguard.exs` for configuration.

# Postgres setup
[Setup on Centos7](https://linode.com/docs/databases/postgresql/how-to-install-postgresql-relational-databases-on-centos-7/)

Change password to postgres user
```
sudo -u user_name psql db_name

or 

ALTER USER postgres WITH PASSWORD 'new_password';
```

Edit /var/lib/pgsql/data/pg_hba.conf

```
local   all   all   trust
```

```
systemctl restart postgresql
```

## Postgres in docker container
```
docker run --name postgres1 -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
```

# Issues encountered

- Building the client files fails with not enough ram
- It runs out of ram on a Centos vps so I needed to add more swap space
- https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-centos-7

# Battlenet API
Battlenet required https for a redirect for authentication. I use caddy for https proxy during development.

Caddyfile
```
https://localhost {
        tls self_signed
        proxy / http://localhost:8080 {
                transparent
                websocket
        }
}
```

# Hosting on Vultr

### Centos setup from scratch
[Enable private networking](https://www.vultr.com/docs/configuring-private-network)
```
/etc/sysconfig/network-scripts/ifcfg-eth1

DEVICE=eth1
ONBOOT=yes
NM_CONTROLLED=no
BOOTPROTO=static
IPADDR=<ip>
NETMASK=<netmask>
IPV6INIT=no
    MTU=1450
```

Disable firewalld (make sure firewall is enabled in vultr config)
```
systemctl disable firewalld
```

Install and start postgresql
```
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

Configure user
```
sudo passwd postgres
su postgres
psql -d template1 -c "ALTER USER postgres WITH PASSWORD 'newpassword';"
```


Allow connections on all interfaces
```
/var/lib/pgsql/data/postgresql.conf

listen_address='*'
```

```
/var/lib/pgsql/data/pg_hba.conf

host    all     all     0.0.0.0/0        md5
```

