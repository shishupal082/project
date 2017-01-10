echo $(date +"%I:%M:%S") : "Dependencies added"

mvn clean install
echo $(date +"%I:%M:%S") : "Adding dependencies"
cp ../../../../program_files/jars/step2-1.0-SNAPSHOT.jar target/
cp ../../../../program_files/jars/java-calculator-1.0.0.rc16.jar target/
echo $(date +"%I:%M:%S") : "Dependencies added"
echo $(date +"%I:%M:%S") : "Running programms"
echo "-----------------------"
java -jar target/step1-*.jar