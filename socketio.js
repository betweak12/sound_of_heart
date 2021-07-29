module.exports = (io) => {
  /**
   * [/videochat] Server Event
   * @event "join-room": room 참여
   * @event "notice": 공지
   * @event "chat": 채팅 보내기
   * @event "leave-room": room 떠나기
   */
  const vcNsc = io.of('/videochat');
  vcNsc.on('connection', (socket) => {
    console.log(socket);
    vcNsc.on('notice', (notice) => {
      vcNsc.emit('message', notice);
    });
    socket.on('join-room', (roomId, username) => {
      socket.join(roomId);

      vcNsc.to(roomId).emit('message', `${username} 님이 입장하였습니다.`);

      socket.on('chat', (msg) => {
        console.log(msg);
        vcNsc.to(roomId).emit('message', username, msg);
      });
      socket.on('leave-room', () => {
        socket.leave(roomId);
      });
    });
    socket.on('disconnect', () => {
      console.log('socket is disconnected');
    });
  });

  // socket.on('message', (msg) => {
  //   socket.to(roomId).emit('message', `socket ${msg}`);
  //   chatRoom.to(roomId).emit('message', `ns: ${msg}`);
  //   // NameSpace vs socket의 차이:
  //   // 메시지를 전송하는 주체가 Namespace level
  //   // chatRoom.to()...
  //   // vs
  //   // 소켓 level (socket.to()...)
  //   // Room상관없이 이벤트를 발생
  // });
};
