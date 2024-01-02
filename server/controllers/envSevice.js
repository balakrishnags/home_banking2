const db = require("../database/database")
const { decryptData, encryptData, presenttimestamp } = require("../utils/common")




// store the envfile details
module.exports.addEnvData = async (req, res) => {
    try {
        const { keyName, accessKey, type } = req.body

        if (type) {
            let _keyName = encryptData(JSON.stringify(keyName))
            let _accessKey = encryptData(JSON.stringify(accessKey))

            const checkSql = 'SELECT keyName FROM envfiledata WHERE envtype=? AND keyName=?'

            db.query(checkSql, [type, _keyName], async (err, result) => {
                if (err) {
                    console.error('Error inserting user data:', err);
                    return res.status(500).json({ status: 500, error: 'Internal server error' });
                }
                if (result.length > 0) {
                    return res.status(400).json({ status: 400, error: `KeyName already exists for ${type} environment` });
                }

                const addEnvDataFun = (sql, values) => {
                    db.query(sql, values, (err, result) => {
                        if (err) {
                            console.error('Error inserting user data:', err);
                            return res.status(500).json({ status: 500, error: 'Internal server error' });
                        }
                        // console.log("🚀 ~ file: userservice.js:894 ~ db.query ~ result:", result)
                        // if (result.affectedRows < 1) {
                        //     return res.status(400).json({ status: 400, error: '' });
                        // }
                        return res.status(201).json({ status: 201, message: "env file added" });
                    });
                }
                const sql = 'INSERT INTO envfiledata (keyName,accessKey,envtype,createdDate,updatedDate,status) VALUES (?,?,?,?,?,?)';
                const values = [_keyName, _accessKey, type, presenttimestamp, presenttimestamp, 1];
                addEnvDataFun(sql, values)
            })
        } else {
            return res.status(400).json({ status: 400, error: 'type required' });
        }
    } catch (err) {
        // console.log("🚀 ~ file: userservice.js:705 ~ module.exports.signup= ~ err:===>", err)
        return res.status(500).send({
            status: 500,
            error: "Internal server error"
        })
    }
}

// get env data based on name
module.exports.getEnvData = async (req, res) => {
    try {
        const { envtype } = req.params
        const getEnvDataFun = (sql, values) => {
            db.query(sql, values, (err, result) => {
                if (err) {
                    console.error('Error inserting user data:', err);
                    return res.status(500).json({ status: 500, error: 'Internal server error' });
                }
                // console.log("🚀 ~ file: userservice.js:894 ~ db.query ~ result:", result)
                if (result.length < 1) {
                    return res.status(404).json({ status: 404, error: 'no data' });
                }

                // const _result = {};
                // result.forEach(item => {
                //     const { keyName, accessKey } = item;
                //     _result[JSON.parse(decryptData(keyName))] = JSON.parse(decryptData(accessKey))
                // });

                const _result = result.map(item => {
                    let keyName = JSON.parse(decryptData(item.keyName))
                    let accessKey = JSON.parse(decryptData(item.accessKey))
                    item = { keyName: keyName, accessKey: accessKey }
                    return item
                })

                return res.status(201).json({ status: 201, message: "env data", data: _result });

            });
        }
        const sql = 'SELECT keyName,accessKey FROM envfiledata WHERE envtype=?';
        getEnvDataFun(sql, [envtype])

    } catch (err) {
        // console.log("🚀 ~ file: userservice.js:705 ~ module.exports.signup= ~ err:===>", err)
        return res.status(500).send({
            status: 500,
            error: "Internal server error"
        })
    }
}

// get environment list
module.exports.getEnvList = async (req, res) => {
    try {
        const getEnvDataFun = (sql, values) => {
            db.query(sql, values, (err, result) => {
                if (err) {
                    console.error('Error inserting user data:', err);
                    return res.status(500).json({ status: 500, error: 'Internal server error' });
                }
                // console.log("🚀 ~ file: userservice.js:894 ~ db.query ~ result:", result)
                if (result.length < 1) {
                    return res.status(404).json({ status: 404, error: 'no data' });
                }


                return res.status(201).json({ status: 201, message: "env data", data: result });

            });
        }
        const sql = 'SELECT id,type FROM envtype WHERE status=1';
        getEnvDataFun(sql)

    } catch (err) {
        // console.log("🚀 ~ file: userservice.js:705 ~ module.exports.signup= ~ err:===>", err)
        return res.status(500).send({
            status: 500,
            error: "Internal server error"
        })
    }
}

//add environment name
module.exports.addEnvList = async (req, res) => {
    try {
        const { name } = req.body

        if (name) {
            const addEnvDataFun = (sql, values) => {
                db.query(sql, values, (err, result) => {
                    if (err) {
                        if (err.code === "ER_DUP_ENTRY") {
                            return res.status(400).json({ status: 400, error: 'Name already exist' });
                        }
                        // console.error('Error inserting user data:', err);
                        return res.status(500).json({ status: 500, error: 'Internal server error' });
                    }

                    return res.status(201).json({ status: 201, message: "New Environment Created" });
                });
            }
            const sql = 'INSERT INTO envtype (type,createdDate,updatedDate,status) VALUES (?,?,?,?)';
            const values = [name, presenttimestamp, presenttimestamp, 1];
            addEnvDataFun(sql, values)
        } else {
            return res.status(400).json({ status: 400, error: 'name required' });
        }
    } catch (err) {
        // console.log("🚀 ~ file: userservice.js:705 ~ module.exports.signup= ~ err:===>", err)
        return res.status(500).send({
            status: 500,
            error: "Internal server error"
        })
    }
}

// update environment name
module.exports.updateEnvList = async (req, res) => {
    try {
        const { name } = req.body
        const { envName } = req.params

        if (name) {
            const sql = 'UPDATE envtype SET type=?,updatedDate=? WHERE type=?';
            const values = [name, presenttimestamp, envName];
            db.query(sql, values, (err, result) => {
                if (err) {
                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(400).json({ status: 400, error: 'Name already exist' });
                    }
                    // console.error('Error inserting user data:', err);
                    return res.status(500).json({ status: 500, error: 'Internal server error' });
                }
                // console.log("🚀 ~ file: userservice.js:1687 ~ db.query ~ result:", result)
                if (result.affectedRows < 1) {
                    return res.status(404).json({ status: 404, error: 'Enter valid environment' });
                }

                return res.status(200).json({ status: 200, message: "Environment Name Updated" });
            });
        } else {
            return res.status(400).json({ status: 400, error: 'name required' });
        }
    } catch (err) {
        // console.log("🚀 ~ file: userservice.js:705 ~ module.exports.signup= ~ err:===>", err)
        return res.status(500).send({
            status: 500,
            error: "Internal server error"
        })
    }
}

// delete environment name
module.exports.deleteEnvname = async (req, res) => {
    try {
        const { envName } = req.params
        const isName = 'SELECT type from envtype WHERE type=?'

        db.query(isName, [envName], async (err, result1) => {
            if (err) {
                // console.error('Error inserting user data:', err);
                return res.status(500).json({ status: 500, error: 'Internal server error' });
            }
            if (result1.length < 1) {
                return res.status(404).json({ status: 404, error: 'Environment not Found' });
            }
            const sql = 'DELETE FROM envtype WHERE type=?';
            const fileDataSql = 'DELETE FROM envfiledata WHERE envtype=?'
            db.query(`${sql};${fileDataSql};`, [envName, envName], (err, result) => {
                if (err) {
                    // console.error('Error inserting user data:', err);
                    return res.status(500).json({ status: 500, error: 'Internal server error' });
                }

                return res.status(200).json({ status: 200, message: "Environment deleted" });
            });
        })
    } catch (err) {
        // console.log("🚀 ~ file: userservice.js:705 ~ module.exports.signup= ~ err:===>", err)
        return res.status(500).json({
            status: 500,
            error: "Internal server error"
        })
    }
}