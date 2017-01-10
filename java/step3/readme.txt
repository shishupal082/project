
It will create jar file from Manifest.MF

Create Mainclass #HelloWorld.java
Compile #javac HelloWorld.java
Run #java HelloWorld

Create jar file #jar -cvfm HelloWorld.jar Manifest.MF HelloWorld.class
Run jar file #java -jar HelloWorld.jar

Even though Main-Class in Manifest.MF shows as red but still working fine.

The above jar file created can be put anywhere and use as a standlone application.
Here, c=compile, v=??, f=??, m=Means custom manifest file

Compile a java program which is a package

javac "src/com/step3/HelloWorld.java" // It will create a class file at the same location as java file
java -classpath "src" com.step3.HelloWorld // It will run the above class file created

javac -d "classes" "src/com/step3/HelloWorld.java" // It will create a class file in classes folder
java -classpath "classes" com.step3.HelloWorld // It will run the above class file created



For standlone
-------------------------------
javac -d "target/classes" standlone/HelloWorld.java
java -classpath "target/classes" HelloWorld

# First go to classes folder then run below command
java HelloWorld

jar -cvfm ../HelloWorld.jar ../../META-INF/StandloneManifest.MF HelloWorld.class


For package based application
-------------------------------
v1
---------
javac -d "target/classes" "src/com/step3/HelloWorld.java"
java -classpath "target/classes" com.step3.HelloWorld

First go to classes folder then run below command
java com.step3.HelloWorld
jar -cvfm ../HelloWorld.jar ../../META-INF/MANIFEST.MF com/step3/HelloWorld.class

v2
--------
javac -d "target/classes" -sourcepath src "src/com/step3/HelloWorld.java"


v3
--------
javac -d "target/classes" -classpath ".:/Users/shishupalkumar/.m2/repository/com/step2/step2/1.0-SNAPSHOT/step2-1.0-SNAPSHOT.jar" -sourcepath src "src/com/step3/HelloWorld.java"
java -classpath ".:/Users/shishupalkumar/.m2/repository/com/step2/step2/1.0-SNAPSHOT/step2-1.0-SNAPSHOT.jar:target/classes" com.step3.HelloWorld

First go to classes folder then run below command

jar -cvfm ../HelloWorld.jar ../../META-INF/MANIFEST.MF com/step3/*.class com/step3/service/*.class
java -jar ../HelloWorld.jar

v4
--------
javac -d "target/classes" -classpath ".:/Users/shishupalkumar/.m2/repository/com/step2/step2/1.0-SNAPSHOT/step2-1.0-SNAPSHOT.jar:/Users/shishupalkumar/.m2/repository/info/cukes/java-calculator/1.0.0.RC16/java-calculator-1.0.0.RC16.jar" -sourcepath src "src/com/step3/HelloWorld.java"
java -classpath ".:/Users/shishupalkumar/.m2/repository/com/step2/step2/1.0-SNAPSHOT/step2-1.0-SNAPSHOT.jar:/Users/shishupalkumar/.m2/repository/info/cukes/java-calculator/1.0.0.RC16/java-calculator-1.0.0.RC16.jar:target/classes" com.step3.HelloWorld

First go to classes folder then run below command

jar -cvfm ../HelloWorld.jar ../../META-INF/MANIFEST.MF com/step3/*.class com/step3/service/*.class
java -jar ../HelloWorld.jar