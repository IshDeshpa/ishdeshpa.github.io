#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

mkdir $SCRIPT_DIR/build
make4ht -u -d $SCRIPT_DIR/build -B $SCRIPT_DIR/build $SCRIPT_DIR/resume.tex "html5"
pdflatex -output-directory=build $SCRIPT_DIR/resume.tex
mv $SCRIPT_DIR/build/resume.pdf $SCRIPT_DIR/resume.pdf
