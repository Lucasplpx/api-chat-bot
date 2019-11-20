const { addUser, removeUser, getUser, getUsersInRoom } = require('../controllers/users');

module.exports = function (io) {

    io.on('connection', (socket) => {

        socket.on('grupo', ({ name, room }, callback)=>{
            const { error, user } = addUser({ id: socket.id, name, room });
            
            if(error) return callback(error);
    
            socket.join(user.room);
    
            socket.emit('message', { user: 'admin', text: `${user.name}, Bem vindo ao grupo ${user.room} aqui você pode interagir com o (Bot) apenas digitando seu nome "bot" e fazendo-o alguma pergunta sobre procedimentos médicos.` });
            socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, entrou!` });
    
            io.to(user.room).emit('roomData', { room: user.room , users: getUsersInRoom(user.room)});
    
            callback();
        });
    
        socket.on('sendMessage', (message, callback)=> {
            const user = getUser(socket.id);

            if(message.toUpperCase().includes("BOT-T")){
                let msg = message.split('BOT-T').join('').trim();
                let msg_final = removerAcentos(msg);

                io.to(user.room).emit('message', { user: 'chatbot', text: msg_final });
            } else {
                io.to(user.room).emit('message', { user: user.name, text: message });
            }          
            
            callback();
        });
    
        socket.on('disconnect', ()=>{
            const user = removeUser(socket.id);
    
            if(user){
                io.to(user.room).emit('message', { user: 'admin', text: `${user.name} saiu.` });
                io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
            }
        });
    });

}

function removerAcentos(str) {
    const RegExp = /[''\,-]/g;
    const string = str.replace(RegExp, "").trim();
    return string;
}