echo "Building Docker image..."
docker build -t nodejs-app-image:latest  ./app/
kubectl apply -f kube-resources --recursive
