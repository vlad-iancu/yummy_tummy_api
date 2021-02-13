let files = require('fs')
let path = require('path')
import * as express from 'express'
type FieldSpec = {
    name: string,
    type: string,
    presence: "MANDATORY" | "OPTIONAL"
    content?: "email" | "phone" | "alphanumeric"
}
type Route = {
    path: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS",
    params?: Array<FieldSpec>
    body?: Array<FieldSpec>
}
function createValidator(specs) {
    return function (req: express.Request, res: express.Response, next: express.NextFunction) {
        let error = false
        let route: Route = specs.filter(
            (route) => 
            route.method === req.method && req.path === route.path)[0]
        if (!route) {
            next()
            return
        }
        let data = req.body
        error = validateFieldBlock(req.body, route.body, res)
        if (!error) {
            error = validateFieldBlock(req.query, route.params, res)
        }
        
        if (!error)
            next();
    }
}
function validateFieldBlock(data: any, body: Array<FieldSpec>, res: express.Response): boolean {
    
    let error = false;
    body?.forEach(({ name, type, presence, content }) => {
        if (data[name] == null && presence === "MANDATORY" && !error) {
            error = true
            res.status(400)
            res.send({ message: `Parameter '${name}' is missing` })
            return;
        }
        if (presence === "MANDATORY" && typeof data[name] != type && !error) {
            error = true
            res.status(400),
                res.send({ message: `Parameter '${name}' is not of type '${type}'` })
            return;
        }
        if (presence === "MANDATORY" && type == "string" && !data[name] && !error) {
            error = true
            res.status(400)
            res.send({ message: `Parameter '${name}' is missing` })
            return;
        }
        if (content === "email" && !error) {
            if (data[name] && !validateEmail(data[name])) {
                error = true
                res.status(400)
                res.send({ message: `Parameter '${name}' is not a valid email address` })
                return
            }
        }
        if (content === "alphanumeric" && !error) {
            if (data[name] && !validateName(data[name])) {
                error = true
                res.status(400)
                res.send({ message: `Parameter '${name}' must contain only letters numbers and underscore characters` })
                return
            }
        }
        if (content === "phone" && !error) {
            if (data[name] && !validatePhone(data[name])) {
                error = true
                res.status(400)
                res.send({ message: `Parameter '${name}' is not a valid phone number` })
                return
            }
        }
    })
    return error;
}
function validateEmail(emailAdress) {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailAdress.match(regexEmail)) {
        return true;
    } else {
        return false;
    }
}
function validateName(name) {
    let nameRegex = /^([A-Za-z0-9\s\_]*)$/;
    if (name.match(nameRegex)) {
        return true;
    }
    else return false;
}
function validatePhone(phone) {
    let phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if (phone.match(phoneRegex)) {
        return true;
    } else {
        return false;
    }
}
const specs = JSON.parse(files.readFileSync(path.resolve("./api_specs.json")))
module.exports.createValidator = createValidator
module.exports.specs = specs