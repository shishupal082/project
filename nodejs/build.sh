version=1.0.1

rm -rf build/*.tar.gz
npm install
tar czf build/nodejs-project-v$version.tar.gz node_modules src config package.json run_tcp_server.sh run_ping_thread.sh
cp build/nodejs-project-v$version.tar.gz /f/nodejs/

