module.exports = function(){
    console.error("YO");
    require("http").request("/jquery.min.js", function(res){
        
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.error(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.error('No more data in response.')
        })
    })
}
module.exports.init = function(){};