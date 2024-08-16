// Node server listen config
// Start the server listening on port 3000. Output message to console once server has started. (diagnostic only)

module.exports = {
    listen: function(server, PORT){
        server.listen(PORT, () => {
            let d = new Date();
            let h = d.getHours();
            let m = d.getMinutes();
            console.log('Server has been started on port ' + PORT + ' at ' + h + ':' + m);
        });
    }
}
