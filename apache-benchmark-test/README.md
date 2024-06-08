# About

Apache Benchmark Test is a tool who makes a benchmark to test the time spend on requests.
it makes number of request simultaneously to a endpoint. When one of the request ends, it start another until the number of total requests configured.

ex:
ab -n 100 -c 10 http://localhost:3000/products

this command will make 10 simultaneously requests and making new one until finish all 100 requests.


# Benchmark test

Let's test our project with and without cache

with Redis as cache:

./ab-product-api-local.sh /products

Without Redis as cache:

./ab-product-api-local.sh /products-without-cache
