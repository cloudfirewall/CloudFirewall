from setuptools import setup,find_packages

#setup.py files

setup(
     name='CloudFirewall',
     version='0.1',
     author="Cloud FireWall",
     author_email="info@cloudfirewall.io",
     description="CloudFirewall-Agent packages",
     long_description=open('README.txt','r').close() + '\n\n' + open('CHANGELOG.txt','r').close(),
     url="https://github.com/cloudfirewall/CloudFirewall",
     packages=find_packages(),
     classifiers=[
         "Programming Language :: Python :: 3",
         "License :: Free To Use But Restricted",
         "Operating System :: OS Independent",
         
     ],
 )