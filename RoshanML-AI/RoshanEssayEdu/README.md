# RoshanEssayEdu

To validate essays, the program uses a API to check for plagiarism (copyright). It also uses a modified version of GPT-2 to detect the likelihood that the text was real or fake. Then it outputs a validation score using these 2 scores. In order to grade the essay, it uses a neural network model trained on the automatic essay grading dataset on Kaggle found here https://www.kaggle.com/c/asap-aes/data.

This is an ongoing, open source project. Please contribute so this project can be finished faster.

`git clone https://github.com/roshancode/RoshanEssayEdu`

Quickstart
   Install dependencies for Python >3.6 :

   `pip install -r requirements.txt`
   
   `run server for gpt-2-small:`
   
   `python server.py`
   
Extend the backend

The backend defines a number of api models which can be invoked by starting the server with the parameter --ModelNAME. To add a custom model, you need to write your own api in backend/api.py and add the decorator @register_api(name=NAME).

Extend the frontend

the source code for the front-end is in client/src.

To modify, installing of node dependencies is necessary:

    `cd client/src; npm install; cd ../..`
    
re-compilation of front-end:

    `> rm -rf client/dist;cd client/src/; npm run build; cd ../..`
