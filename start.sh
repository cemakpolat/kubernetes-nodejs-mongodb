echo "Building Docker image..."
docker build -t nodejs-app-image:latest  ./app/
kubectl delete -f kube-resources --recursive
kubectl apply -f kube-resources --recursive
