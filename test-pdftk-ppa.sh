#!/bin/bash

echo "Testing pdftk installation with PPA..."
echo "=========================================="

# Test if pdftk is available
echo "Checking pdftk availability:"
which pdftk
echo "Return code: $?"

echo ""
echo "Testing pdftk version:"
pdftk --version
echo "Return code: $?"

echo ""
echo "Available pdftk binaries:"
find /usr -name "*pdftk*" 2>/dev/null || echo "No pdftk binaries found in /usr"

echo ""
echo "Checking PATH:"
echo $PATH

echo ""
echo "All available PDF tools:"
which pdf* 2>/dev/null || echo "No PDF tools found"

echo ""
echo "Testing with full path:"
/usr/bin/pdftk --version 2>&1 || echo "pdftk not found at /usr/bin/pdftk"

echo ""
echo "Installed packages containing 'pdf':"
dpkg -l | grep pdf || echo "No PDF packages found"
