# RoshanStock
A Stock Recommend System Developed in Python

Main Requirement:
Python 3.5.2

Keras 2.0.6 TensorFlow 1.2

pymongo

tqdm nltk

googletrans

Install
brew install mongodb --with-openssl

brew services start mongodb

mongod --dbpath (Your Porject Folder)/Data/DB

`git clone https://github.com/roshancode/RoshanStock/`

When you storing stock data with mongodb mode, you may meet too many open files problem, try the following codes in command line:

    sysctl -w kern.maxfiles=20480 (or whatever number you choose)
    sysctl -w kern.maxfilesperproc=18000 (or whatever number you choose)
    launchctl limit maxfiles 1000000 (or whatever number you choose)
    brew services restart mongodb
    mongodump -h localhost:27017 -d DB_STOCK -o ./
