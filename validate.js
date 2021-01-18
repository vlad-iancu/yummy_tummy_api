let files = require('fs')
let path = require('path')
function createValidator(specs) {
    return function (req, res, next) {
        let route = specs.filter((route) => route.method === req.method && req.path === route.path)[0]
        let data = req.body
        let error = false
        route.params.forEach(({ name, type, presence }) => {
            if (data[name] == null && presence === "MANDATORY") {
                error = true
                res.status(400)
                res.send({ message: `Parameter '${name}' is missing` })
                return
            }
            if (presence === "MANDATORY" && typeof data[name] != type) {
                error = true
                res.status(400),
                    res.send({ message: `Parameter '${name}' is not of type '${type}'` })
                return
            }

        });
        if (!error)
            next();
    }
}
const specs = JSON.parse(files.readFileSync(path.join(__dirname, "api_specs.json")))
module.exports.createValidator = createValidator
module.exports.specs = specs