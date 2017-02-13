#!/usr/bin/env python

import socket

TCP_IP = '127.0.0.1'
TCP_PORT = 9090
BUFFER_SIZE = 20
MESSAGE = 'Hello World'

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((TCP_IP, TCP_PORT))
print "Send request : ", MESSAGE
s.send(MESSAGE)
data = s.recv(BUFFER_SIZE)
s.close()

print "Response : ", data