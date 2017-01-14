Create jar file individual classes
--------------------------------------

Step4
--------
javac -d "out" -classpath ".:/Users/shishupalkumar/.m2/repository/com/step2/step2/1.0-SNAPSHOT/step2-1.0-SNAPSHOT.jar" -sourcepath src "src/Step4.java"
java -classpath ".:/Users/shishupalkumar/.m2/repository/com/step2/step2/1.0-SNAPSHOT/step2-1.0-SNAPSHOT.jar:out/" Step4

First go to out folder then run below command

jar -cvfm Step4.jar ../META-INF/MANIFEST.MF Step4.class
java -jar Step4.jar

HelloWorld
--------
javac -d "out" -sourcepath src "src/HelloWorld.java"
java -classpath ".:out/" HelloWorld

First go to out folder then run below command

jar -cvfm HelloWorld.jar ../META-INF/HelloWorld-MANIFEST.MF HelloWorld.class
java -jar HelloWorld.jar