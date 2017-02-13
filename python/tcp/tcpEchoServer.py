#!/usr/bin/env python

import socket
import datetime

TCP_PORT = 9090
BUFFER_SIZE = 20  # Normally 1024, but we want fast response

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('', TCP_PORT))
s.listen(1)
print 'TcpEchoServer started on :', TCP_PORT
while 1:
    conn, addr = s.accept()
    print 'Connection address :', addr
    data = conn.recv(BUFFER_SIZE)
    if data is None or (data and len(data) < 1):
        print "No data send."
        now = datetime.datetime.now()
        data = now.strftime("%Y-%m-%d %H:%M")
    else:
        print "Request : ", data
        data = data.upper()
    
    print "Response : ", data
    conn.send(data)
    conn.close()
