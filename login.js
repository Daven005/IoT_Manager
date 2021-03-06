var utils = require('./utils');
const user = config.login.user;
const pwd = config.login.pwd;

/* Design of Login functions

See also IOT.js setupLogin function

session object contains logged in status and lastRequest - that invoked the login

If not logged in login web page is displayed
If the user logs in correctly the original URL is invoked to try again

Similar functions for desktop and mobile

*/

exports.doLogin = function (request, response) {
    if (request.query.logout == 1) {
        request.loggedIn = false;
        request.session.destroy();
    }
    response.render("login", {});
}

exports.doMobileLogin = function (request, response) {
    if (request.query.logout == 1) {
        request.loggedIn = false;
        request.session.destroy();
    }
    response.render("loginMobile", {
        loggedIn: request.loggedIn
    });
}

exports.checkResponse = function (request, response) {
    if (request.query.Action == "Login") {
        if (request.query.User == user && request.query.Pwd == pwd) {
            request.session.loggedIn = request.loggedIn = true;
            if (utils.saveTypeUrl(request.session.lastRequest))
                response.redirect(request.session.lastRequest);
            // else if (request.useMobile)
            //     response.render('mobileErrors', {
            //         map: alarmLog.mapFmt(),
            //         type: 'Alarm',
            //         loggedIn: request.loggedIn
            //     });
            // else
            //     response.render('alarms', {
            //         map: alarmLog.mapFmt(),
            //         err: ""
            //     });
            return;
        }
    }
    if (request.query.Type == "Mobile")
        response.render("loginMobile", {
            loggedIn: request.loggedIn
        })
    else
        response.render("login", {})
}

exports.check = function (request, response) {
    if (request.session.loggedIn)
        return true;
    if (request.body.User == user && request.body.Pwd == pwd && request.body.tempLogin == "doit_")
        return true;
    if (request.useMobile)
        response.render("loginMobile", {
            loggedIn: false
        });
    else
        response.render("login", {});
    return false;
}

exports.saveInfoDesktop = function (req, res, next) { // express routing function
    req.useMobile = false;
    if (utils.saveTypeUrl(req.path)) { // Ignore non functional URLs
        req.session.lastRequest = req.originalUrl;
    }
    req.loggedIn = req.session.loggedIn;
    //console.log("Rqd: %s %j %j", req.session.lastRequest, req.useMobile, req.loggedIn );
    next();
}

exports.saveInfoMobile = function (req, res, next) { // express routing function
    req.useMobile = true;
    if (utils.saveTypeUrl(req.path)) { // Ignore non functional URLs
        req.session.lastRequest = req.originalUrl;
    }
    req.loggedIn = req.session.loggedIn;
    res.locals.desktopLink = 'http://' + req.ip + ':' + config.browser.desktop_port + '/'; // Not used ??!!
    //console.log("Rqm: %s %j %j", req.session.lastRequest, req.useMobile, req.loggedIn );
    next();
}