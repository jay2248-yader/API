const { QueryTypes, Sequelize } = require('sequelize');

const sequelize = new Sequelize('CSCVT2022', 'sa', 'Ad123456', {
    // host: '172.20.10.3',
    host: '192.168.3.151',
    // port: "1433",  // <----------------The port number you copied
    dialect: "mssql",
    // operatorsAliases: false,
    dialectOptions: {
        options: {
            encrypt: false,
            requestTimeout: 300000
        }
    },
    // pool: {
    //     max: 5,
    //     min: 0,
    //     acquire: 30000,
    //     idle: 10000
    // }
});

exports.select = async (sql) => {
    try {
        const datas = await sequelize.query(sql, { type: QueryTypes.SELECT });
        return datas;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

exports.logIn = async (username, password) => {
    let datass = {};
    let sql = `SELECT TOP 1 CODE,MYNAMETH,(SELECT  TOP 1
        [CODE]
    FROM [dbo].[CSMSTRIGHTUSER] WHERE USERCODE ='${username}' ORDER BY ROWORDER ASC) CODES FROM [CSUSER] WHERE [CODE] = '${username}' AND [USERPASS] ='${password}' `;
    const datas = await sequelize.query(sql, { type: QueryTypes.SELECT });
    // let sql2 = `SELECT * FROM [TABLE_LOCATION_USERS] WHERE USERCODE = '${username}'`;
    // const datas2 = await sequelize.query(sql2, { type: QueryTypes.SELECT });
    // datas2.forEach();
    if (datas.length > 0) {
        datass = {
            userCODE: datas[0].CODE,
            userNAME: datas[0].MYNAMETH,
            userCODES: datas[0].CODES,
            // userDEPTLOCATION: datas2[0].DEPARTMENT,
            // userGROUPS: datas2[0].GROUPS
        };
    }
    return datass;
}