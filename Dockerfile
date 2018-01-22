# TODO: start of a docker file for build on a centos image
FROM quay.io/concur_platform/centos:7.3.1611-4390ad7
MAINTAINER https://github.com/concur/docker-centos-elixir
LABEL Description="Build image with Erlang 20.2 | Elixir 1.5.2"

ENV LANG=en_US.UTF-8 ELIXIR_VERSION=1.5.2 ERLANG_VERSION=20.2
WORKDIR /root

RUN yum -y install epel-release &&  \
    yum -y install gcc gcc-c++ glibc-devel make ncurses-devel wget \
                   openssl-devel autoconf java-1.8.0-openjdk-devel \
                   git wxBase.x86_64 unzip which && \
    yum clean all && \
    localedef -i en_US -f UTF-8 en_US.UTF-8

RUN curl -OLS --compressed https://raw.githubusercontent.com/kerl/kerl/master/kerl && \
    chmod a+x /root/kerl && \
    /root/kerl update releases && \
    /root/kerl build $ERLANG_VERSION $ERLANG_VERSION && \
    /root/kerl install $ERLANG_VERSION /usr/lib/erlang && \
    /root/kerl cleanup all && \
    ln -s /usr/lib/erlang/bin/ct_run /usr/bin/ct_run && \
    ln -s /usr/lib/erlang/bin/dialyzer /usr/bin/dialyzer && \
    ln -s /usr/lib/erlang/bin/epmd /usr/bin/epmd && \
    ln -s /usr/lib/erlang/bin/erl /usr/bin/erl && \
    ln -s /usr/lib/erlang/bin/erlc /usr/bin/erlc && \
    ln -s /usr/lib/erlang/bin/escript /usr/bin/escript && \
    ln -s /usr/lib/erlang/bin/run_erl /usr/bin/run_erl && \
    ln -s /usr/lib/erlang/bin/start /usr/bin/start && \
    ln -s /usr/lib/erlang/bin/start_erl /usr/bin/start_erl && \
    ln -s /usr/lib/erlang/bin/to_erl /usr/bin/to_erl && \
    ln -s /usr/lib/erlang/bin/typer /usr/bin/typer

RUN curl -OLS --compressed https://github.com/elixir-lang/elixir/releases/download/v$ELIXIR_VERSION/Precompiled.zip && \
    unzip -o -d /usr/lib/elixir Precompiled.zip && \
    rm Precompiled.zip && \
    ln -s /usr/lib/elixir/bin/elixir /usr/bin/elixir && \
    ln -s /usr/lib/elixir/bin/mix /usr/bin/mix && \
    ln -s /usr/lib/elixir/bin/elixirc /usr/bin/elixirc && \
    ln -s /usr/lib/elixir/bin/iex /usr/bin/iex && \
    mix local.hex --force && \
    mix local.rebar --force && \
    mix hex.info

# TODO: install yarn
# RUN curl -OLS --compressed https://nodejs.org/dist/v6.10.3/node-v6.10.3-linux-x64.tar.xz && \
#     tar xpvf node-v6.10.3-linux-x64.tar.xz && \
#     mv /root/node-v6.10.3-linux-x64 /usr/lib/node && \
#     ln -s /usr/lib/node/bin/node /usr/bin/node && \
#     ln -s /usr/lib/node/bin/npm /usr/bin/npm

CMD "/bin/bash"
