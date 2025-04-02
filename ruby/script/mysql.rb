require 'mysql'
con = Mysql.new('localhost', 'root', 'root', 'tests')  
rs = con.query('select * from links')
rs.each_hash { |h| puts h['id']+"---"+h['link']}
con.close