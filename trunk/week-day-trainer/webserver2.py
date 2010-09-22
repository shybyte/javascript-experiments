from os import getcwd
from SimpleHTTPServer import SimpleHTTPRequestHandler
import SocketServer
import sys


class MyHandler(SimpleHTTPRequestHandler):

    def do_GET(self):
        global fileNames;
        """Serve a GET request."""
        f = self.send_head()
        
        fileNames.add(f.name[len(getcwd())+1:])
        
        if f:
            self.copyfile(f, self.wfile)
            f.close()

def main():
    global fileNames;
    fileNames = set()
    
    
    try:
        PORT = 8000
        
        httpd = SocketServer.TCPServer(("", PORT), MyHandler)
        
        print "serving at port", PORT
        httpd.serve_forever()
    except KeyboardInterrupt:
        if "manifest" in sys.argv:
            manifestFile = open('offline-generated.manifest','w')
            for filename in fileNames:
                manifestFile.write(filename+"\n");
            manifestFile.close()
        print '^C received, shutting down server'
        httpd.socket.close()

if __name__ == '__main__':
    main()

