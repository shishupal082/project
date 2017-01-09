
It will create jar file from Manifest.MF

Create Mainclass #HelloWorld.java
Compile #javac HelloWorld.java
Run #java HelloWorld

Create jar file #jar -cvfm HelloWorld.jar Manifest.MF HelloWorld.class
Run jar file #java -jar HelloWorld.jar

Even though Main-Class in Manifest.MF shows as red but still working fine.



Compile a java program which is a package

javac "src/com/step3/HelloWorld.java" // It will create a class file at the same location as java file
java -classpath "src" com.step3.HelloWorld // It will run the above class file created

javac -d "classes" "src/com/step3/HelloWorld.java" // It will create a class file in classes folder
java -classpath "classes" com.step3.HelloWorld // It will run the above class file created



For standlone
-------------------------------
javac HelloWorld.java
java HelloWorld
jar -cvfm HelloWorld.jar Manifest.MF HelloWorld.class
java -jar HelloWorld.jar

The above jar file created can be put anywhere and use as a standlone application.
Here, c=compile, v=??, f=??, m=Means custom manifest file


For package based application
-------------------------------
javac -d "classes" "src/com/step3/HelloWorld.java"
java -classpath "classes" com.step3.HelloWorld

First go to classes folder then run below command

jar -cvfm ../target/HelloWorld.jar ../META-INF/MANIFEST.MF com/step3/HelloWorld.class
jar -cvfm target/HelloWorld.jar META-INF/MANIFEST.MF "classes/com/step3/HelloWorld.java"