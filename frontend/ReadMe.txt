http://w2ui.com/kickstart/ -> framework per il frontend.

https://github.com/eirslett/frontend-maven-plugin

-> https://stackoverflow.com/questions/17103748/how-to-deploy-a-node-js-app-with-maven

# You've got two choices:
# 
# 	https://github.com/eirslett/frontend-maven-plugin to let maven download your npm modules from your package.json and let it automagically install node and npm all along
# 	https://github.com/mulesoft/npm-maven-plugin to let maven download your npm packages that you have specified in the pom.xml
# As a hacky solution, though still feasible you could as you've mentioned yourself, use something like maven-antrun-plugin to actually execute npm with maven.
# 
# All approaches have their pros and cons, but frontend-maven-plugin seems to be the most often used approach - but it assumes that your ci server can download from the internet arbitrary packages, whereas the "hacky" solution should also work, when your ci server has no connection to the internet at all (besides proxying the central maven repo)



mvn archetype:generate -DgroupId=com.accenture.intesa.anage -DartifactId=frontend -DarchetypeArtifactId=maven-archetype-webapp -DinteractiveMode=false


#Attualmente per poterlo far funzionare ho copiato in tomcat ROOT (C:\Program Files\Apache\apache-tomcat-7.0.59\webapps\ROOT) la cartella api/json


