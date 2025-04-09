FROM openjdk:17
EXPOSE 8088
ADD target/CodingGame-0.0.1-SNAPSHOT.jar CodingGame.jar
ENTRYPOINT ["java", "-jar", "CodingGame.jar"]
