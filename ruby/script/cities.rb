require 'mysql'
con = Mysql.new('localhost', 'root', 'root', 'tests')

rs = con.query('select * from offers')
i = 0
rs.each_hash {
	|h| puts h['city_name']+"--"+i.to_s
	i = i+1
	puts "name"
}

con.close