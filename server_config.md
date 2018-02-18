# Issues encountered
- Building the client files fails with not enough ram
- It runs out of ram on a Centos vps so I needed to add more swap space
- https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-centos-7

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

# Database backup script
```
ssh -i ./prod_ssh_key root@<addr> 'su - postgres -c "pg_dump -U postgres myapp_prod"' >> "$(date +"%Y_%m_%d_%I_%M_%p")backup.sql"
```
