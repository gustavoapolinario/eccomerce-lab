# About

This project was created to test and refresh my skills wih:

- Backend node.js
- Front Vue.js
- Document Database mongoDB
- Queue with RabbitMQ
- Events with Kafka

## How it works

![Architecture](./ecommerce-lab.jpg)

### Front end

It has a simple front-end with Vue.js. The Vue generates a static page who list all products requesting the product-api.

### Product API

The product API is a node.js service with:

- Express to create the API
- Mongoose to manage the Document Database for Products
- Redis for Cache the responses

### Apache benchmark-test

Apache Benchmark Test is a tool who makes a benchmark to test the time spend on requests.

Verify the README on this folder to run and make your own tests

### Buy-api

On the list of products, you can click to buy the product (fake, of course).

When click on it, the buy-api will receive the request and save the information of product bought on a Queue in RabbitMQ.

### Buy-job

This project receive the product bought in Queue and process it.

After bought, service generates an Event on Kafka.


<br>
<hr>

# Docker compose

To dev and test the applications, I created a docker compose configuration.

The docker compose start the environment with all envs who the apps need.

## Dev Environment

```bash
docker compose -f docker-compose-dev.yml up
```

## Local tests with image builds

```bash
docker compose up
```

## How to test

http://localhost:8080/

## Logs

```bash
docker compose logs -f
```


## Container Image

### Build Image

```bash
docker compose build
```

or

```bash
docker compose build [NAME]
ex: docker compose build front-end
```


### Push Image

```bash
docker compose push
```

or

```bash
docker compose push [NAME]
ex: docker compose push front-end
```

<br>
<hr>


# Minikube

## Start Minikube

```bash
minikube start
minikube dashboard
```

## Install Databases

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
kubectl apply -f gitops/databases-helm/mongodb/mongodb-configmap.yml
helm upgrade --install mongo bitnami/mongodb \
  --set auth.username=product-api \
  --set auth.password=product-api-password \
  --set auth.database=products \
  --set persistence.size=1Gi \
  --set initdbScriptsConfigMap=mongo-init-configmap \
  --version 15.6.9

helm upgrade --install redis bitnami/redis \
  --set global.redis.password=your_redis_password \
  --set master.persistence.size=300Mi \
  --set replica.persistence.size=300Mi \
  --set replica.replicaCount=1 \
  --version 19.5.5

helm upgrade --install rabbitmq bitnami/rabbitmq \
  --set auth.username=rabbitmq \
  --set auth.password=rabbitmq-password \
  --set persistence.size=1Gi \
  --version 14.4.4

helm upgrade --install kafka bitnami/kafka \
  --set auth.enabled=false \
  --set controller.persistence.size=1Gi \
  --set zookeeper.persistence.size=1Gi \
  --set controller.replicaCount=1 \
  --set zookeeper.replicaCount=1 \
  --set listeners.client.protocol=PLAINTEXT \
  --version 29.3.4

helm repo add kafka-ui https://provectus.github.io/kafka-ui-charts
helm install kafka-ui kafka-ui/kafka-ui \
  --set kafka.clusters[0].name=kafka \
  --set kafka.clusters[0].bootstrapServers=kafka:9092 \
  --set auth.type=disabled \
  --set management.health.ldap.enabled=false
```

## Install microservices

```bash
kubectl apply -f gitops/apps/
```

## Test applications

```bash
kubectl port-forward svc/front-end-service 8080 &
kubectl port-forward svc/product-api-service 3000 &
kubectl port-forward svc/buy-api-service 3001 &
kubectl port-forward svc/eccomerce-lab-kafka-ui 9080:80 &
```


## Verify Mongodb Data

```bash
kubectl run -i --tty --rm mongo-client --image=mongo --restart=Never -- bash
mongosh "mongodb://product-api:product-api-password@mongo-mongodb:27017/products"
db.products.find().pretty()
```

## Verify Redis Data

```bash
kubectl run -i --tty --rm redis-client --image=redis --restart=Never -- bash
redis-cli -h redis-master -a your_redis_password
KEYS *
```

## Clean up

```bash
kubectl delete -f gitops/apps/
helm uninstall mongo
helm uninstall redis
helm uninstall rabbitmq
helm uninstall kafka bitnami/kafka
helm uninstall kafka-ui
kubectl delete -f gitops/databases-helm/mongodb/mongodb-configmap.yml
```


<br>
<hr>

# GitOps with ArgoCD

## Start Minikube

```bash
minikube start
minikube dashboard
```

## Install ArgoCD

```bash
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/v2.5.8/manifests/install.yaml
```

## Acess the UI

```bash
kubectl port-forward svc/argocd-server -n argocd 9090:443
```

## Get Admin Password

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```

## Install databases

The folder gitops/databases-helm/ have all ArgoCD Application needed to install all databases.

```bash
kubectl apply -f gitops/databases-helm/kafka/
kubectl apply -f gitops/databases-helm/kafka-ui/
kubectl apply -f gitops/databases-helm/mongodb/
kubectl apply -f gitops/databases-helm/rabbitmq/
kubectl apply -f gitops/databases-helm/redis/
```

## Install microservices

To install the apps, We will use the ApplicationSet. It will get all configuration from the github automatically

```bash
argocd appset create gitops/ArgoCD-apps.yml --port-forward --port-forward-namespace argocd
```

## Clean up

```bash
argocd app delete argocd/eccomerce-lab-redis --cascade --port-forward --port-forward-namespace argocd
argocd app delete argocd/eccomerce-lab-rabbitmq --cascade --port-forward --port-forward-namespace argocd
argocd app delete argocd/eccomerce-lab-kafka --cascade --port-forward --port-forward-namespace argocd
argocd app delete argocd/eccomerce-lab-kafka-ui --cascade --port-forward --port-forward-namespace argocd
argocd app delete argocd/eccomerce-lab-mongodb --cascade --port-forward --port-forward-namespace argocd
argocd appset delete eccomerce-lab-apps
```
