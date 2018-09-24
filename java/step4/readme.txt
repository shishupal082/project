Create jar file individual classes
--------------------------------------

Step4
--------
javac -d "out" -classpath ".:/Users/shishupalkumar/.m2/repository/com/step2/step2/1.0-SNAPSHOT/step2-1.0-SNAPSHOT.jar" -sourcepath src "src/Step4.java"
java -classpath ".:/Users/shishupalkumar/.m2/repository/com/step2/step2/1.0-SNAPSHOT/step2-1.0-SNAPSHOT.jar:out/" Step4

First go to out folder then run below command

jar -cvfm Step4.jar ../META-INF/MANIFEST.MF Step4.class

*****This file can be run standlone*****
java -jar Step4.jar





HelloWorld
-----------
Method-1]
**************

javac -d "out" -sourcepath src "src/HelloWorld.java"

Note: If out directory is not there then it will not compile
	  If success It will create a file HelloWorld.class
	  Which can be run after going to out folder and type the command "java HelloWorld"


Method-2]
**************

If you want to run that class from step4 directory then type below command
Command "java out/HelloWorld" will not work

java -classpath ".:out/" HelloWorld

Method-3]
**************

First go to out folder then run below command

jar -cvfm HelloWorld.jar ../META-INF/HelloWorld-MANIFEST.MF HelloWorld.class

*****This file can be run standlone*****
java -jar HelloWorld.jar