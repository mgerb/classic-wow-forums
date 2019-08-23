version=$(git describe --tags)

docker push mgerb/classic-wow-forums:latest
docker push mgerb/classic-wow-forums:$version
