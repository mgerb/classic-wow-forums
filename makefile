clean:
	rm -rf ./priv/static
	rm -rf _build

build-client:
	cd client && npm install && npm run build

build-server:
	MIX_ENV=prod mix deps.get && MIX_ENV=prod mix release --env=prod

all: clean build-client build-server
