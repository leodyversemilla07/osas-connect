#!/bin/bash

# Set Java environment variables for apt-installed Java
export JAVA_HOME="/app/.apt/usr/lib/jvm/java-21-openjdk-amd64"
export PATH="$JAVA_HOME/bin:/app/.apt/usr/bin:$PATH"

# Set Java headless mode and security options to prevent GUI-related errors and security configuration issues
# Explicitly disable security manager to bypass security file loading issues
export JAVA_OPTS="-Djava.awt.headless=true -Djava.security.manager= -Djava.security.egd=file:/dev/./urandom -Dfile.encoding=UTF-8 -Djava.net.useSystemProxies=false"

# Set PDFTK command for easier access
export PDFTK_CMD="/app/.apt/usr/bin/pdftk.pdftk-java"
