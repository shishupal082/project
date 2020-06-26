function initialize(self, $S, TemplateHelper, Api, initialPrintDataApi) {
    var i, template;
    setTimeout(function() {
        $S.loadJsonData(null, [initialPrintDataApi + "?" + $S.getRequestId()], function(response) {
            var formRowFields = self.state.formRowFields;
            if ($S.isArray(response)) {
                if (formRowFields.length > response.length) {
                    for(i=0; i<response.length; i++) {
                        template = self.getFormRowTemplate(response[i].templateName);
                        if (template) {
                            formRowFields[i] = {
                                templateData: TemplateHelper.updateTemplateValue(template, response[i].data),
                                formRowId: "row-" + i,
                                templateName: response[i].templateName
                            };
                        }
                    }
                } else {
                    for(i=0; i<formRowFields.length; i++) {
                        template = self.getFormRowTemplate(response[i].templateName);
                        if (template) {
                            formRowFields[i] = {
                                templateData: TemplateHelper.updateTemplateValue(template, response[i].data),
                                formRowId: "row-" + i,
                                templateName: response[i].templateName
                            };
                        }
                    }
                    for(i=formRowFields.length; i<response.length; i++) {
                        template = self.getFormRowTemplate(response[i].templateName);
                        if (template) {
                            formRowFields.push({
                                templateData: TemplateHelper.updateTemplateValue(template, response[i].data),
                                formRowId: "row-" + i,
                                templateName: response[i].templateName
                            });
                        }
                    }
                }
            } else {
                $S.log("Invalid response (initialPrintDataApi):" + response);
            }
            formRowFields = self.adjustFormRowFieldsRowId(formRowFields);
            self.setState({formRowFields: formRowFields}, function() {
                self.handleFormSubmit("printDisplay");
            });
        }, null, null, Api.getAjaxApiCallMethod());
    }, 1000);
}
export default initialize;
