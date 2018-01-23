# Web Chatroom
> Only for practice

一个简易的多人网页聊天室，根据之前的项目 [MultiClientWebChat](https://github.com/firejq/MultiClientWebChat) 更改而来，使用 Spring Boot 进行开发，并加入了 websocket 子协议
 [stomp](http://jmesnil.net/stomp-websocket/doc/) 和 SockJS 的支持。

启动项目后访问 127.0.0.1:8080 即可：

![image](http://otaivnlxc.bkt.clouddn.com/jpg/2018/1/23/fd804844af4902b124c6506af4b30d58.jpg)

## Feature and Achieve

- 客户端设置了自动重连机制：
    
    在最大重连次数限制内，与服务器断开连接后每隔10秒自动重连。

## License

The Web Chatroom is under the MIT license.