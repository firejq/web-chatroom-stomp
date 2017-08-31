# Web Chatroom
根据之前的项目 [MultiClientWebChat](https://github.com/firejq/MultiClientWebChat) 更改而来，使用 Spring Boot 进行开发，并加入了 websocket 子协议
 [stomp](http://jmesnil.net/stomp-websocket/doc/) 和 SockJS 的支持
 
> Only for practice

## Feature and Achieve

- 客户端设置了自动重连机制：
在最大重连次数限制内，与服务器断开连接后每隔10秒自动重连

## License
The Web Chatroom is under the MIT license.