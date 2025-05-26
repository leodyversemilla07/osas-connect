#!/bin/bash

# Set Java environment variables for apt-installed Java
export JAVA_HOME="/app/.apt/usr/lib/jvm/java-21-openjdk-amd64"
export PATH="$JAVA_HOME/bin:/app/.apt/usr/bin:$PATH"

# Set Java headless mode and completely disable security system to prevent configuration issues
# Create empty security properties file and use it to bypass Java security initialization
echo "# Empty security properties" > /tmp/java.security.empty
export JAVA_OPTS="-Djava.awt.headless=true -Djava.security.manager= -Djava.security.properties=/tmp/java.security.empty -Djava.security.policy= -Djava.security.auth.login.config= -Djava.security.egd=file:/dev/./urandom -Dfile.encoding=UTF-8 -Djava.net.useSystemProxies=false -Djava.util.prefs.systemRoot=/tmp -Djava.util.prefs.userRoot=/tmp"

# Set PDFTK command for easier access
export PDFTK_CMD="/app/.apt/usr/bin/pdftk.pdftk-java"
