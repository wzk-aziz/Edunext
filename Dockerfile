FROM openjdk:17
<<<<<<< HEAD
EXPOSE 8087
ADD target/Forum-0.0.1-SNAPSHOT.jar Forum.jar
ENTRYPOINT ["java", "-jar", "Forum.jar"]



=======
EXPOSE 8088
ADD target/CodingGame-0.0.1-SNAPSHOT.jar CodingGame.jar
ENTRYPOINT ["java", "-jar", "CodingGame.jar"]
>>>>>>> origin/courseandquizesback
