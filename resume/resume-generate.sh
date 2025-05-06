#!/bin/bash

make4ht -u -d build -B build resume.tex "html5"
pdflatex -output-directory=build resume.tex
mv build/resume.html resume.html
mv build/resume.css resume.css
mv build/resume.pdf resume.pdf
