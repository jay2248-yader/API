const conn = require('../config/connection');
exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await conn.logIn(username, password);
        if (Object.keys(user).length !== 0) {
            // const token = await jwt.sign(user,
            //     secretKey,
            //     { expiresIn: '4h' });

            // const expires_in = jwt.decode(token);
            const dataUser = {
                // access_token: token,
                // expire_in: expires_in.exp,
                // token_type: 'Bearer',
                userCODE: user.userCODE,
                userNAME: user.userNAME,
                userCODES: user.userCODES,
                // userDEPTLOCATION: user.userDEPTLOCATION,
                // userGROUPS: user.userGROUPS
            }
            return res.status(200).json(dataUser);
        } else {
            return res.status(404).json('Not found');
        }
    } catch (error) {
        next(error);
    }
}


exports.priceChecks = async (req, res, next) => {
    try {
        const productcode = req.params.productcode;
        let sql = `SELECT  ST.CURRENCYCODE,ST.DOCDATE,ST.REMARK,ST.TAXTYPE,STS.PRODUCTCODE,STS.PRODUCTNAME,STS.UNITCODE,STS.SALEPRICE1 
        FROM CSSTDARPRICE ST INNER JOIN CSSTDARPRICESUB STS ON ST.DOCNO = STS.DOCNO
        WHERE ST.CLOSEFLAG = 0 AND STS.PRODUCTCODE = '${productcode}' ORDER BY ST.DOCDATE DESC
        `;
        const data = await conn.select(sql);

        let sql2 = `SELECT TOP 1000 [REBATE]
        ,[PRODUCTNAME]
        ,[PRODUCTCODE]
        ,[WAREHOUSE]
        ,[WHNAME]
        ,[LOCATION]
        ,[LOCNAME]
        ,[UNITCODE]
        ,[UNITNAME]
        ,[STOCKQTY]
        ,[PURCHASEORDER]
        ,[SALEORDER]
        ,[CUSTORDER]
        ,[SEARCH_NAME]
        ,[SITECODE]
    FROM [CSV_STKWAREHOUSE2] WHERE PRODUCTCODE = '${productcode}'`;
        const data2 = await conn.select(sql2);
        const data3 = await conn.select("select * from tblTaxType")
        const datas = { 'dataPrice': data, 'dataWarehouse': data2, dataTaxType: data3[0] };
        // console.log(datas)
        res.status(200).json(datas);
    } catch (error) {
        next(error)
    }
}


exports.getProductCode = async (req, res, next) => {
    try {
        const barcode = req.params.barcode;
        let sql = `SELECT TOP 1 [PRODUCTCODE] FROM [CSBARCODE] WHERE BARCODE = '${barcode}' AND CLOSEFLAG = 0`;
        const data = await conn.select(sql);
        res.status(200).json(data[0]['PRODUCTCODE']);
    } catch (error) {
        next(error);
    }
}

exports.getProductLocation = async (req, res, next) => {
    try {
        const product = req.params.productcode;
        let sql = `SELECT tc.id,tc.LOCATION,tc.WH FROM TABLE_LOCATION_COUNT tc INNER JOIN TABLE_LOCATION_COUNT_SUB tcs ON tc.ID = tcs.LOCATION_ID 
        WHERE tcs.PRODUCTCODE = '${product}' AND tcs.STAT = 'new' AND tc.STATE is NULL ORDER BY tc.LOCATION`;
        const data = await conn.select(sql);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}


exports.getProductByName = async (req, res, next) => {
    try {
        const { product } = req.body;
        const products = product.split(' ');
        let ps = '';
        for (let i of products) {
            ps += `(c.NAMEEN LIKE N'%${i}%' OR c.CODE LIKE N'%${i}%' OR c.NAMETH LIKE N'%${i}%') AND`;
        }
        let sqls = `SELECT TOP 100 c.NAMEEN,c.NAMETH,c.CODE FROM [CSPRODUCT] c WHERE  ${ps}  c.CLOSEFLAG = 0`;
        const data = await conn.select(sqls);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}