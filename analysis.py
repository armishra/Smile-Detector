#!/usr/bin/env python2
# -*- coding: utf-8 -*-

API_KEY = 'b7c0774564ac21ae1b4e2f6ab66038fc'
API_SECRET = 'iIZN7-OzqdnYKfa10Jxv14Uk6C73sefe'

import sys
import pymongo
import os
import datetime
from pymongo import MongoClient

for arg in sys.argv:
    file_name_1 = arg
 
# Import system libraries and define helper functions
# 导入系统库并定义辅助函数
import time
from pprint import pformat
def print_result(hint, result):
    def encode(obj):
        if type(obj) is unicode:
            return obj.encode('utf-8')
        if type(obj) is dict:
            return {encode(k): encode(v) for (k, v) in obj.iteritems()}
        if type(obj) is list:
            return [encode(i) for i in obj]
        return obj
    #print hint
    result = encode(result)    
    print '\n'.join(['  ' + i for i in pformat(result, width = 75).split('\n')])

# First import the API class from the SDK
# 首先，导入SDK中的API类
from facepp import API

api = API(API_KEY, API_SECRET)

def uploadData():
    #Upload result to MongoDB collection
    MONGO_URL = 'mongodb://<user>:<password>@kahana.mongohq.com:10031/sconnect'
    #client = MongoClient(MONGO_URL)
    # Specify the database
    db = client.sconnect
    db = client.mytestdatabase
    # Print a list of collections
    print db.collection_names()
     
    # Specify the collection, in this case 'monsters'
    collection = db.monsters
     
    # Get a count of the documents in this collection
    count = collection.count()
    print "The number of documents you have in this collection is:", count
     
    # Create a document for a monster
    monster = {"name": name,
               "gender": gender,
               "smile": smile,
               }
    # Insert the monster document into the monsters collection
    monster_id = collection.insert(monster)

#IMAGE_DIR = 'http://oi59.tinypic.com/2aiep8y.jpg' Tanay Frown
#IMAGE_DIR = 'http://oi60.tinypic.com/x26hcx.jpg' Archit
#IMAGE_DIR = 'http://oi59.tinypic.com/2z6yyr4.jpg' Tanay smile
IMAGE_DIR = file_name_1
PERSONS = [
    ('Tanay/Archit', IMAGE_DIR),
]
TARGET_IMAGE = IMAGE_DIR

# Step 1: Detect faces in the 3 pictures and find out their positions and
# attributes
# 步骤1：检测出三张输入图片中的Face，找出图片中Face的位置及属性

FACES = {name: api.detection.detect(url = url)
        for name, url in PERSONS}

for name, face in FACES.iteritems():
    print_result(name, face)


# Step 2: create persons using the face_id
# 步骤2：引用face_id，创建新的person
for name, face in FACES.iteritems():
    rst = api.person.create(
            person_name = name, face_id = face['face'][0]['face_id'])
    print_result('create person {}'.format(name), rst)

# Step 3: create a new group and add those persons in it
# 步骤3：.创建Group，将之前创建的Person加入这个Group
rst = api.group.create(group_name = 'test')
print_result('create group', rst)
rst = api.group.add_person(group_name = 'test', person_name = FACES.iterkeys())
print_result('add these persons to group', rst)

# Step 4: train the model
# 步骤4：训练模型
rst = api.train.identify(group_name = 'test')
print_result('train', rst)
# wait for training to complete
# 等待训练完成
rst = api.wait_async(rst['session_id'])
print_result('wait async', rst)

# Step 5: recognize face in a new image
# 步骤5：识别新图中的Face
rst = api.recognition.identify(group_name = 'test', dir = TARGET_IMAGE)
print_result('recognition result', rst)
print '=' * 60
print 'The person with highest confidence:', \
        rst['face'][0]['candidate'][0]['person_name']

# Finally, delete the persons and group because they are no longer needed
# 最终，删除无用的person和group
api.group.delete(group_name = 'test')
api.person.delete(person_name = FACES.iterkeys())

