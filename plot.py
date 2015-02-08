# brew or pip install matplotlib AND scipy
# inject into hello.py code
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.mlab as mlab
import math
from scipy.stats import norm

mean = 0
variance = 1
sigma = math.sqrt(variance)
x = np.linspace(-3,3,100)

plt.grid()
plt.plot(x,mlab.normpdf(x,mean,sigma))
smileLevel = 1.6######################### make this input from the hello.py code ###############

#SmileLevel point
plt.scatter(smileLevel,norm.pdf(smileLevel,mean,sigma))

plt.show()