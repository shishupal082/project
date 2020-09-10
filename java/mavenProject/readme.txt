Simple maven project created.

Setting up of jdk path
	- JAVA_HOME=C:\Users\<User>\.jdks\openjdk-14.0.1
	- put JAVA_HOME bin path in path variable
		- Add in path %JAVA_HOME%\bin
		- echo %PATH% should display jdk path in cmd prompt

Download link for maven and setup guide
    - https://maven.apache.org/download.cgi
    - Download apache-maven-3.6.3-bin.zip

Extract and put in c drive
Add MAVEN_HOME in system variable (C:\opt\apache-maven-3.6.3)
Add path variable in system variable (%MAVEN_HOME%\bin)
Now open new cmd window and try mvn -version (It should work)


