# build and push nginx
docker build -t kwangdock/k8s-docker-simple-blog-nginx ./nginx && 
docker push kwangdock/k8s-docker-simple-blog-nginx

# build and push web
docker build -t kwangdock/k8s-docker-simple-blog-web ./web && 
docker push kwangdock/k8s-docker-simple-blog-web 

# build and push posts
docker build -t kwangdock/k8s-docker-simple-blog-posts ./posts && 
docker push kwangdock/k8s-docker-simple-blog-posts

# build and push comments
docker build -t kwangdock/k8s-docker-simple-blog-comments ./comments && 
docker push kwangdock/k8s-docker-simple-blog-comments 

# build and push querys
docker build -t kwangdock/k8s-docker-simple-blog-querys ./querys && 
docker push kwangdock/k8s-docker-simple-blog-querys 

# build and push event-bus 
docker build -t kwangdock/k8s-docker-simple-blog-event-bus ./event-bus && 
docker push kwangdock/k8s-docker-simple-blog-event-bus 

# build and push moderation
docker build -t kwangdock/k8s-docker-simple-blog ./moderation && 
docker push kwangdock/k8s-docker-simple-blog-moderation
