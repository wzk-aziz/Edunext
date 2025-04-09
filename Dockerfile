FROM openjdk:17
EXPOSE 8087
ADD target/Forum-0.0.1-SNAPSHOT.jar Forum.jar
ENTRYPOINT ["java", "-jar", "Forum.jar"]



