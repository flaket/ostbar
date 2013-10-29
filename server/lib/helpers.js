// Handlebars helpers

var moment = require('moment');

module.exports.register = function(hbs) {
    //  usage: {{datetimeformat creation_date format="MMMM YYYY"}}
    hbs.registerHelper('datetimeformat', function(context, options) {
        var f = options.hash.format || "DD. MMM YYYY[, kl ]HH:mm";
        if (!context) {
            return '';
        }
        return moment(context).format(f);
    });

    hbs.registerHelper('ago', function(context) {
        if (!context) {
            return '';
        }
        return moment(context).fromNow();
    });
};
