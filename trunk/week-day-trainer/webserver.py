#Copyright Jon Berg , turtlemeat.com

import string,cgi,time
from os import curdir, sep
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
#import pri

class MyHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        try:
            print ">>>>>>>>>>>>>>>>"+self.path;
            if not ".." in self.path:
                filename = "./"+self.path.split("?")[0][1:]
                f = open(filename);
                print "--------------->"+filename;
                self.send_response(200)
                #self.send_header('Content-type',	'text/html')
                self.end_headers()
                self.wfile.write(f.read())
                f.close()
                return
            return
                
        except IOError:
            self.send_error(404,'File Not Found: %s' % self.path)
     

def main():
    try:
        server = HTTPServer(('', 80), MyHandler)
        print 'started httpserver...'
        server.serve_forever()
    except KeyboardInterrupt:
        print '^C received, shutting down server'
        server.socket.close()

if __name__ == '__main__':
    main()

