"""
python setup.py sdist bdist_wheel
python -m twine upload --repository-url https://test.pypi.org/legacy/ dist/*

"""
import setuptools

with open("README.md", "r") as fh:
    readme = fh.read()

setuptools.setup(
    name="dorna_gui",
    version= "2.2",
    author="Dorna Robotics",
    author_email="info@dorna.ai",
    description="Dorna Gui",
    long_description=readme,
    long_description_content_type='text/markdown',
    url="https://dorna.ai/",
    project_urls={
        'gitHub': 'https://github.com/dorna-robotics/dorna-gui',
    },    
    packages=setuptools.find_packages(),
    classifiers=[
        'Intended Audience :: Developers',
        'Programming Language :: Python :: 3.7',
        "Operating System :: OS Independent",
        'Topic :: Software Development :: Libraries :: Python Modules',
    ],
    install_requires=[
        "setuptools",
        "eventlet",
        "dorna",
        "flask-socketio",
        "flask",
        "PyYAML",
    ],
    license="MIT",
    include_package_data=True,
    zip_safe = False,
)
