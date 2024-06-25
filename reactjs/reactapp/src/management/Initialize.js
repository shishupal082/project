function initialize(self, $S, TemplateHandler, Api, initialPrintDataApi) {
    var i, template;
    setTimeout(function() {
        $S.loadJsonData(null, [initialPrintDataApi + "?" + $S.getRequestId()], function(response) {
            if ($S.isArray(response)) {
                var formRowFields = self.state.formRowFields;
                if (formRowFields.length > response.length) {
                    for(i=0; i<response.length; i++) {
                        template = self.getFormRowTemplate(response[i].templateName);
                        if (template) {
                            formRowFields[i] = {
                                templateData: TemplateHandler.updateTemplateValue(template, response[i].data),
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
                                templateData: TemplateHandler.updateTemplateValue(template, response[i].data),
                                formRowId: "row-" + i,
                                templateName: response[i].templateName
                            };
                        }
                    }
                    for(i=formRowFields.length; i<response.length; i++) {
                        template = self.getFormRowTemplate(response[i].templateName);
                        if (template) {
                            formRowFields.push({
                                templateData: TemplateHandler.updateTemplateValue(template, response[i].data),
                                formRowId: "row-" + i,
                                templateName: response[i].templateName
                            });
                        }
                    }
                }
                formRowFields = self.adjustFormRowFieldsRowId(formRowFields);
                self.setState({formRowFields: formRowFields}, function() {
                    self.handleFormSubmit("printDisplay");
                });
            } else {
                $S.log("Invalid response (initialPrintDataApi):" + response);
            }
        }, null, null, Api.getAjaxApiCallMethod());
    }, 1000);
}
export default initialize;
