mvn clean install
echo $(date +"%I:%M:%S") : "Adding dependencies"
cp $HOME/.m2/repository/org/slf4j/slf4j-api/1.7.5/slf4j-api-1.7.5.jar target/
cp $HOME/.m2/repository/log4j/log4j/1.2.17/log4j-1.2.17.jar target/
cp $HOME/.m2/repository/org/slf4j/slf4j-log4j12/1.7.5/slf4j-log4j12-1.7.5.jar target/
echo $(date +"%I:%M:%S") : "Dependencies added"
echo $(date +"%I:%M:%S") : "Running programms"
echo "-----------------------"
java -jar target/todo-*.jar