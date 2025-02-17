const { promises } = require('dns');
var fs = require('fs');
const { resolve } = require('path');

module.exports = class ReadCommandSql {
    async retornaStringSql(chave, controller) {

        var commandRegex = '';

        try {
            
            await new Promise(async (resolve) => {

                await fs.readFile(`./server/scripts/${controller}.sql`, function(err, buf){
                    if (err) { 
                        console.log(err);
                        resolve();
                    }

                    var str = buf.toString();
                    var regex = new RegExp(`^--INIT#${chave}#(.*?)^--END#${chave}#`, "sm");

                    commandRegex = str.match(regex);
                    commandRegex = commandRegex[0].toString().replace(`--INIT#${chave}#`,'').replace(`--END#${chave}#`,'');

                    resolve();
                })

            });

        } catch (error) {
            
        }

        return commandRegex;

    }
}