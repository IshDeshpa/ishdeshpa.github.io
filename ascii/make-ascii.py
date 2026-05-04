import os
import shutil
import glob
from distutils.dir_util import copy_tree

srcfiles = glob.glob('./src/*.ts')
cmd = 'tsc --allowJs -m ES6 -t ES6 --outDir ./dist --sourceMap --alwaysStrict ' + ' '.join(srcfiles)
print('Building TypeScript: ' + cmd)
os.system(cmd)

#copy_tree('./src/static', './dist')
shutil.copy('./src/index.html', './dist/index.html')
