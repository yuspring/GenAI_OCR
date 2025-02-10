#!/bin/bash
magick image.jpg -density 300 -despeckle -sharpen 0x2 image.png
