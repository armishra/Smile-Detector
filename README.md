# Photo Booth CV Application

Using Face++ API. Note that python2.7 is required.

## 1. Hardware Drivers
Using the tessel board and accompanying camera module, we modified existing JavaScript drivers to perform to our needs. Such as file directory handling and naming convention. Hardware Drivers are viewable at:

https://github.com/xenonvector/Hackathon/tree/master/tessel-code


## 2. Analysis
This is a demo of the combination of our tessel hardware and Face++ API hack. This is the main file that initializes analysis on the facial image. It calls on Face++ API and with the combination of a BASH script, the process is executed from taking a picture to generating the analysis.

Sample Picture #1:


![drawing](http://ia.media-imdb.com/images/M/MV5BMjA3MzIzMjM5Nl5BMl5BanBnXkFtZTgwOTI5OTQzMjE@._V1_SX640_SY720_.jpg =450x450)

Sample Output #1:
```
Jim Parsons
  {'face': [{'attribute': {'age': {'range': 7, 'value': 33},
                           'gender': {'confidence': 99.9936,
                                      'value': 'Male'},
                           'race': {'confidence': 97.6082,
                                    'value': 'White'},
                           'smiling': {'value': 2.70393}},
             'face_id': '1f470bc56b3e361d90d87545e8b836af',
             'position': {'center': {'x': 42.19457, 'y': 24.166667},
                          'eye_left': {'x': 37.580317, 'y': 20.741},
                          'eye_right': {'x': 46.056561, 'y': 20.11},
                          'height': 13.333333,
                          'mouth_left': {'x': 39.800679, 'y': 27.785167},
                          'mouth_right': {'x': 46.00181, 'y': 27.373333},
                          'nose': {'x': 41.772398, 'y': 24.882167},
                          'width': 17.873303},
             'tag': ''}],
   'img_height': 1220,
   'img_id': '0cf42f603fc9ddcbf890f7b8d49b40d4',
   'img_width': 900,
```
