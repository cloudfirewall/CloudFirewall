from setuptools import setup,find_packages

setup(
     name='Cloudfirewall-Server',  
     version='0.0.1',
     author="Gagan Bikram Shah  ",
     author_email="gaganbikram.gbs@gmail.com",
     description="CloudFirewall-Server packages",
     long_description=open('README.txt').read() + '\n\n' + open('CHANGELOG.txt').read(),
     url="",
     packages=find_packages(),
     classifiers=[
         "Programming Language :: Python :: 3",
         "License :: OSI Approved :: MIT License",
         "Operating System :: OS Independent",
     ],
 )