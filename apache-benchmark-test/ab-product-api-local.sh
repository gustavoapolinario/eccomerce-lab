url=$1
if [ "$url" == "" ];then
  url="/products"
fi
docker_ip=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ecommerce-lab-product-api-1)
docker run --network=ecommerce-lab_default --rm apache-benchmark ab -n 100 -c 10 http://$docker_ip:3000$url