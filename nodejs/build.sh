oldVersion=1.0.1
newVersion=1.0.2
echo "$(date +"%Y-%m-%d %T") v=$newVersion" >> version.txt
sed -i "s/$oldVersion/$newVersion/1" src/common/AppConstant.js
rm -rf build/*.tar.gz
npm install
tar czf build/nodejs-project-v$newVersion.tar.gz node_modules src config version.txt package.json run_tcp_server.sh run_ping_thread.sh run_db_test.sh
cp build/nodejs-project-v$newVersion.tar.gz /f/app-nodejs/

