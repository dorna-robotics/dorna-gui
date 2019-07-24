# Dorna gui
Dorna gui is a free and open-source software with graphical user interface, used for controlling [Dorna][dorna] robotic arm.
Dorna gui runs [Dorna API][dorna_github] and [Flask server][flask] in the background, and displays the data in a web browser. The best result is achievable via the [Google Chrome][chrome] web browser.

## Installation
Notice that the program is compatible with Python 3.7+.

**GitHub**  
First, use `git clone` to download the repository:  
```bash
git clone https://github.com/dorna-robotics/dorna-gui.git
```
Or simply download the zip file, and uncompressed the file.  
Next, go to the downloaded directory, where `setup.py` file is located, and run:
```bash
python setup.py install
```
## Getting started
To start the software, first create a `Gui` object, and then call the `run()` method.
``` python
from dorna_gui import Gui

Gui().run()
```
The input parameters, and their description for the `run()` method are:  
* `run(log=True, browser=True, debug=False, host="127.0.0.1" ,port=5000)`  
  * When the `log` argument is `True`, then the internal logs appear in the command line. `log=False` blocks internal logs to appear in the command line.  
  * When the `browser` argument is set to `True`, then the gui opens in a new tab in the default browser of the host machine. `browser=False` does not open the software automatically.
  * The `debug` argument controls the debug mode of the background [Flask][flask] server. `True` to start the server in debug mode, `False` to start in normal mode.
  * The `host` argument is the hostname or IP address for the server to listen on. Defaults to `"127.0.0.1"`. If you have debug disabled (`debug=False`) or trust the users on your network, you can make the server publicly available, by setting `host="0.0.0.0"`.
  * The `port` argument is the port number for the server to listen on. Defaults to `5000`.
  
  
[dorna]: https://dorna.ai/
[dorna_github]: https://github.com/dorna-robotics/dorna
[wiki]: https://github.com/dorna-robotics/dorna-gui/wiki
[flask]: http://flask.pocoo.org/
[chrome]: https://www.google.com/chrome/
