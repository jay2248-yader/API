const { Sequelize, QueryTypes } = require('sequelize');

let sequelizeInstance = null; // เก็บ instance ปัจจุบัน

function resetSequelize(site) {
    // ปิด connection เก่าถ้ามี
    if (sequelizeInstance) {
        sequelizeInstance.close().catch(err => console.error('Error closing old sequelize:', err));
    }

    let config;

    switch (site) {
        case 'VT':
            config = {
                database: 'CSCVT2022',
                username: 'sa',
                password: 'Ad123456',
                host: '192.168.3.151'
            };
            break;
        case 'PS':
            config = {
                database: 'CSCPS2022',
                username: 'sa',
                password: 'P@ssword',
                host: '192.168.1.51'
            };
            break;
        case 'PZ':
        default:
            config = {
                database: 'CSCPZ2022',
                username: 'sa',
                password: 'Ad123456',
                host: '192.168.2.151'
            };
            break;
    }

    sequelizeInstance = new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        dialect: 'mssql',
        dialectOptions: {
            options: {
                encrypt: false,
                requestTimeout: 300000
            }
        }
    });

    return sequelizeInstance;
}

// ฟังก์ชัน select query ใช้ instance ปัจจุบัน
async function select(sql, replacements = {}) {
    if (!sequelizeInstance) throw new Error('Sequelize instance not initialized');
    return await sequelizeInstance.query(sql, { type: QueryTypes.SELECT, replacements });
}

// ฟังก์ชัน login
async function logIn(username, password) {
    if (!sequelizeInstance) throw new Error('Sequelize instance not initialized');

    const sql = `
        SELECT TOP 1 CODE, MYNAMETH, (
            SELECT TOP 1 [CODE]
            FROM [dbo].[CSMSTRIGHTUSER]
            WHERE USERCODE = :username
            ORDER BY ROWORDER ASC
        ) CODES
        FROM [CSUSER]
        WHERE [CODE] = :username AND [USERPASS] = :password
    `;

    const datas = await sequelizeInstance.query(sql, {
        type: QueryTypes.SELECT,
        replacements: { username, password }
    });

    if (datas.length > 0) {
        return {
            userCODE: datas[0].CODE,
            userNAME: datas[0].MYNAMETH,
            userCODES: datas[0].CODES
        };
    }
    return {};
}

module.exports = {
    resetSequelize,
    select,
    logIn
};
