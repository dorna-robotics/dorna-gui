import eventlet
from pkg_resources import resource_filename
from dorna import Dorna
import socket
from os import rename, remove

import urllib.request

# python script
from importlib import reload, util


#from . import python_script

import webbrowser

# server
from flask_socketio import SocketIO
from flask import Response, send_file,Flask, render_template, request

# thread
import json, threading, time

eventlet.monkey_patch() 

class Gui(object):
	"""docstring for ClassName"""
	def __init__(self):
		super(Gui, self).__init__()
		self.version = "2.2"
		self._mn = "dorna_gui"
			
	def run(self, log=True, browser=True, debug=False, host="127.0.0.1" ,port=5000):	
		version = self.version

		class dorna_server(object):
			def __init__(self, config_path = None):
				super(dorna_server, self).__init__()
				self.new_dorna(config_path)

			def new_dorna(self, config_path = None):
				self.dorna = Dorna(config_path)
				self.dorna._prnt = log
				self.log = []
				self.dorna.log_start(self.log)

		app = Flask(__name__)
		app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
		socketio = SocketIO(app, async_handlers= True)


		@app.route('/')
		def index():
			host_ip = "unknown"

			try:
				host_ip = get_ip()
			except Exception as ex:
				print("error: ",ex)
				pass
			return render_template('index.html', data = {"host_ip": host_ip, "port": port, "version": version +"."+str(robot.dorna._device["version"])})

		def get_version():
			# software version
			_version = version +"."+str(robot.dorna._device["version"])

			# latest version index
			try:	
				response = urllib.request.urlopen('https://raw.githubusercontent.com/dorna-robotics/version/master/version.json')
				response = json.loads(response.read())
			except Exception as ex:
				message = "Error: no internet connection."
				robot.dorna._log_add({"message": message}, "note")
				return False
			return {"response": response, "version": _version}	


		@socketio.on('download_config')
		def download(data, methods=['GET', 'POST']):
			threading.Thread(target = _download, args = (data,)).start()

		def _download(data):
			_config = robot.dorna.config()
			_config = json.loads(_config)

			robot.dorna._log_add(_config, "download_config")


		@socketio.on('python')
		def get_python(data, methods=['GET', 'POST']):
			threading.Thread(target = _get_python, args = (data,)).start()

		def _get_python(data):
			# rewrite the file
			with open(resource_filename(self._mn, "python_script.py"), 'w') as text_file:
				text_file.write(data["text"])

			# reload module
			spec = util.spec_from_file_location("what.ever", resource_filename(self._mn, "python_script.py"))
			python_script = util.module_from_spec(spec)
			spec.loader.exec_module(python_script)

			# run module
			try:
				python_script.main(robot.dorna)
			except Exception as e:
				robot.dorna._log_add({"message": "Script error", "error": e, "status": 100}, "python_script")
			robot.dorna._log_add({"message": "Script ended", "status": 0}, "python_script")
			return


		@socketio.on('method')
		def get_method(data, methods=['GET', 'POST']):
			threading.Thread(target = _get_method, args = (data,)).start()

		def _get_method(data):
			if "method" in data:
				# method is Connect
				if data["method"] == "connect":
					try:
						if data["type"] == 0: # new
							# new dorna object
							# terminate the current
							robot.dorna._port_close()
							robot.dorna._stop = True
							# generate new
							robot.new_dorna()

						elif data["type"] == 1: # config path
							# load the config
							# terminate the current
							robot.dorna._port_close()
							robot.dorna._stop = True
							# generate new
							robot.new_dorna(data["config_path"])

					except Exception as ex:
						pass

				# run the method
				try:

					result = False
					if "prm" in data:
						result = getattr(robot.dorna, data["method"])(*tuple(data['prm'].values()))

					else:
						result = getattr(robot.dorna, data["method"])

					if "log_key" in data:
						robot.dorna._log_add(json.loads(result), data["log_key"])

					#return result

				except Exception as x:
					return False


		def log_thread():
			while True:
				# read log
				if robot.log:
					data = robot.log.pop(0)
					
					socketio.emit('log', data)
				time.sleep(0.001)

		
		# main
		robot = dorna_server()

		log_t = threading.Thread(target = log_thread)
		log_t.start()



		# browser
		if browser:
			try:
				webbrowser.get().open("http://127.0.0.1:"+str(port),new=2)	
			except:
				pass

		# socket
		socketio.run(app, debug=debug, host=host, port = port)


def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # doesn't even have to be reachable
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

if __name__ == '__main__':
	gui = Gui().run()
