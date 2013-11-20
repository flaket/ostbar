TEGF - The Educational Game Framework
================

This is The Educational Game Framework system

Based on
--------

* node.js
* express
* node-mysql
* handlebars
* passport

Howto
-----

* Clone this repository: ``git clone git://github.com/flaket/ostbar.git``
* Install dependencies: ``npm install``
* Create a settings file, and remember to edit it: ``cp server/settings.js.sample server/settings.js``
* Run: ``node server``
* Open browser at localhost:8888

Developers howto
----------------

You need to have a running MySQL server on your machine to run the server. Username and password configurations for the database connection can be set in server/models/db.js.

Run ``npm install`` to install dependencies, and ensure that all modules are installed correctly (some are dependent on ruby being installed).



* Compile sass on file changes: ``make watch``
* Restart cluster on file changes: ``nodemon server``
* Export current mysql database: mysqldump -h localhost -u USERNAME -p tegf > sql/tegf.sql

Acknowledgements
--------------------
This project is based on the node boilerplate project found at https://github.com/strekmann/node-boilerplate

Copyright and license
---------------------
Copyright © 2013 Fri programvare i skolen, released under the [MIT license](https://github.com/flaket/ostbar/blob/master/LICENSE).
