Step-1]
Install python

which python
python --version

Step-1-1]

If python or pip is not appeared as a command
Then add /Users/<user>/Library/Python/2.7/bin in .bash_profile

PIP=/Users/<user>/Library/Python/2.7/bin
PATH=$PATH:$PIP

Step-2]
Install pip

sudo easy_install pip


sudo pip install --upgrade pip
pip --version

Step-3]
Setup virtual environment
https://packaging.python.org/installing/#creating-and-using-virtual-environments

pip install virtualenv
virtualenv venv
source venv/bin/activate

Step-4]
Install dependencies

pip install -r requirement.txt

Step-5]

Follow tutorial to start application

https://docs.djangoproject.com/en/1.7/intro/tutorial01/

python -c "import django; print(django.get_version())"
