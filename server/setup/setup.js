#!/usr/bin/env node
'use strict';

var request = require('request-promise');

var rootUrl = 'http://localhost:3000/api/';

/**
 * Create admin user function
*/
function createAdmin() {
    var options = {
        method: 'POST',
        uri: rootUrl + 'Admin',
        body: {
            userId: 'admin',
            name: 'Standard Admin'
        },
        json: true
    };

    request(options)
        .then(function(response) {
            console.log('createAdmin', response);
        }, function(err) {
            console.error('createAdmin', err);
        });
}

/**
 * Create customer user function
 */
function createCustomer(customerId, password, firstName, lastName, role) {
    var options = {
        method: 'POST',
        uri: rootUrl + 'Customer',
        body: {
            customerId: customerId,
            password: password,
            firstName: firstName,
            lastName: lastName,
            role: role
        },
        json: true
    };

    request(options).then(function(response) {
        console.log('createCustomer ' + customerId, response);
    }, function(err) {
        console.error('createCustomer ' + customerId, err);
    });
}

/**
 * Execute functions
 */
createAdmin();
createCustomer('manufacturer1', '', 'Manufacturer', 'Co. 1', 'Manufacturer');
createCustomer('manufacturer2', '', 'Manufacturer', 'Co. 2', 'Manufacturer');
createCustomer('distributorA', '', 'Distributor', 'Co. A', 'Distributor');
createCustomer('distributorB', '', 'Distributor', 'Co. B', 'Distributor');
createCustomer('retailer', '', 'Retailer', 'Co', 'Retailer');
createCustomer('recycling1', '', 'Recycling', 'Co. 1', 'Recycling');
createCustomer('recycling2', '', 'Recycling', 'Co. 2', 'Recycling');