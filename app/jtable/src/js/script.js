$(document).ready(function () {
    $('#PersonTableContainer').jtable({
        title: 'Table of people',
        sorting: true,
        paging: true,
        actions: {
            listAction: 'http://localhost:8080/employees',
            createAction: 'http://localhost:8080/employees/create',
            updateAction: '/GettingStarted/UpdatePerson',
            deleteAction: '/GettingStarted/DeletePerson'
        },
        fields: {
            name: {
                title: 'Author Name',
                width: '40%'
            },
            age: {
                title: 'Age',
                width: '20%'
            },
            recordDate: {
                title: 'Record date',
                width: '30%',
                type1: 'date',
                create: false,
                edit: false
            }
        }
    });
    $('#PersonTableContainer').jtable('load');
});
