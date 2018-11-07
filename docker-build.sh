version=$(git describe --tags)

docker build -t mgerb/classic-wow-forums:latest .
docker tag mgerb/classic-wow-forums:latest mgerb/classic-wow-forums:$version
