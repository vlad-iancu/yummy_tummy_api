var files = require('fs');
var path = require('path');
function createValidator(specs) {
    return function (req, res, next) {
        var error = false;
        var route = specs.filter(function (route) { return route.method === req.method && req.path === route.path; })[0];
        var data = req.body;
        route.params.forEach(function (_a) {
            var name = _a.name, type = _a.type, presence = _a.presence, content = _a.content;
            if (data[name] == null && presence === "MANDATORY" && !error) {
                error = true;
                res.status(400);
                res.send({ message: "Parameter '" + name + "' is missing" });
                return;
            }
            if (presence === "MANDATORY" && typeof data[name] != type && !error) {
                error = true;
                res.status(400),
                    res.send({ message: "Parameter '" + name + "' is not of type '" + type + "'" });
                return;
            }
            if (presence === "MANDATORY" && type == "string" && data[name] === "" && !error) {
                error = true;
                res.status(400);
                res.send({ message: "Parameter '" + name + "' is missing" });
                return;
            }
            if (content === "email" && !error) {
                if (data[name] && !validateEmail(data[name])) {
                    error = true;
                    res.status(400);
                    res.send({ message: "Parameter '" + name + "' is not a valid email address" });
                    return;
                }
            }
            if (content === "alphanumeric" && !error) {
                if (data[name] && !validateName(data[name])) {
                    error = true;
                    res.status(400);
                    res.send({ message: "Parameter '" + name + "' must contain only letters numbers and underscore characters" });
                    return;
                }
            }
            if (content === "phone" && !error) {
                if (data[name] && !validatePhone(data[name])) {
                    error = true;
                    res.status(400);
                    res.send({ message: "Parameter '" + name + "' is not a valid phone number" });
                    return;
                }
            }
        });
        if (!error)
            next();
    };
}
function validateEmail(emailAdress) {
    var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailAdress.match(regexEmail)) {
        return true;
    }
    else {
        return false;
    }
}
function validateName(name) {
    var nameRegex = /^([A-Za-z0-9\s\_]*)$/;
    if (name.match(nameRegex)) {
        return true;
    }
    else
        return false;
}
function validatePhone(phone) {
    var phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if (phone.match(phoneRegex)) {
        return true;
    }
    else {
        return false;
    }
}
var specs = JSON.parse(files.readFileSync(path.resolve("./api_specs.json")));
module.exports.createValidator = createValidator;
module.exports.specs = specs;
