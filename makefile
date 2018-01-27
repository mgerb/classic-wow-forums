clean:
	rm -rf ./priv/static
	rm -rf _build

build-client:
	cd client && yarn install && yarn run build

build-server:
	MIX_ENV=prod mix deps.get && MIX_ENV=prod mix release --env=prod

all: clean build-client build-server
