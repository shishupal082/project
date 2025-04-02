class Static
    def initialize(testId)
        @testId = testId
        @htmlFileName = "templates/front_end/303_command.html"
        pages = File.read('data/test-pages.json')
        @pages_json = JSON.parse(pages)
        static = File.read('data/static_files.json')
        @static_json = JSON.parse(static)
    end
    def _get_html()
        return @pages_json[@testId]["html"]
    end
    def get_html_file()
        return self._get_html()
    end
    def _get_file_inList(allFiles, requiredFiles)
        files = Array.new
        if(requiredFiles != nil && requiredFiles.length != 0 && allFiles != nil && allFiles.length != 0) then
            for file in requiredFiles
                if(allFiles[file] != nil) then
                    files.push(allFiles[file])
                end
            end
        end
        return files
    end
    def get_js_file()
        js = @pages_json[@testId]["js"]
        js_files = @static_json["js"]
        files = self._get_file_inList(js_files, js)
        return files
    end
    def get_css_file()
        css = @pages_json[@testId]["css"]
        css_files = @static_json["css"]
        files = self._get_file_inList(css_files, css)
        return files
    end
end