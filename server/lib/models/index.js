const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const runningEnv = process.env.ENVIRONMENT || 'development';

const loggingCustom = (str) => {
    const now = new Date();
    const dateTime = 'D' + now.getDate() + '-M' + (now.getMonth() + 1) + '-Y' + now.getFullYear() + ' ' + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    console.log('\x1b[42m%s\x1b[0m', '-------------- QUERY START [' + dateTime + '] --------------');
    console.log(str);
    console.log('\x1b[41m%s\x1b[0m', '-------------- QUERY FINISH --------------');
};

const dbType = process.env.DB_TYPE || '';
const dbHost = process.env.DB_HOST || '';
const dbName = process.env.DB_NAME || '';
const dbUser = process.env.DB_USER || '';
const dbPass = process.env.DB_PASS || '';
const dbSSL = process.env.DB_SSL || 0;

if (!dbType || !dbHost || !dbName || !dbUser) {
    loggingCustom('Database credential missing');
    process.exit(1);
}

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    dialect: dbType,
    logging: (runningEnv === 'development') ? loggingCustom : false, //loggingCustom - development, false - production
    dialectOptions: {
        connectTimeout: 20000,
        ssl: parseInt(dbSSL)
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

const db = {};

fs.readdirSync(__dirname).filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach((file) => {
    try {
        let stats = fs.lstatSync(path.join(__dirname, file));
        let model;
        if (stats.isDirectory()) {
            let subDir = path.join(__dirname, file);
            fs.readdirSync(subDir)
                .filter((sFile) => {
                    return (sFile.indexOf('.') !== 0);
                })
                .forEach((subFile) => {
                    const model = require(path.join(subDir, subFile))(sequelize, Sequelize.DataTypes);
                    let nameCapitalize = file.charAt(0).toUpperCase() + file.slice(1).toLocaleLowerCase();
                    db[nameCapitalize + model.name] = model;
                });
        } else {
            const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
            db[model.name] = model;
        }
    } catch (e) {
        console.log(e);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;