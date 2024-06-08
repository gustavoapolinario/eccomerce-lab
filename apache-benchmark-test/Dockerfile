FROM ubuntu:latest

RUN apt-get update && apt-get install -y apache2-utils

#ENTRYPOINT [ "/bin/sh", "ab" ]
CMD ["ab", "-h"]
