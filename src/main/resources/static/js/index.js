/**
 * Created by firejq on 2017/8/30
 */
document.getElementById("state-info").innerHTML = "正在准备连接服务器……";
document.getElementById("client-id").innerHTML = "";

// 定义最大重连次数与当前已重连次数，超过上限则不再重连，彻底关闭连接
const maxTryNum = 10;
let curTryNum = 0;

/**
 * 执行连接和连接后的回调操作
 */
const connect = () => {
  // 连接次数加一
  curTryNum = curTryNum + 1;

  // let socket = new SockJS('127.0.0.1:8080/endpoint');
  let socket = new SockJS('/endpoint');
  stompClient = Stomp.over(socket);

  stompClient.connect(
    {},
    // 连接成功回掉函数
    (frame) => {
      //连接成功时将当前已重连次数归零
      curTryNum = 0;

      document.getElementById("state-info").innerHTML = "连接成功";

      // 获取 websocket 连接的 sessionId
      const sessionId = /\/([^\/]+)\/websocket/.exec(socket._transport.url)[1];
      console.log("connected, session id: " + sessionId);
      document.getElementById("client-id").innerHTML = "你的sessionId为【"
        + sessionId + "】";

      // 订阅广播消息
      const subscription_broadcast = stompClient.subscribe('/topic/getResponse',
        (response) => {
        if (response.body) {
          printToScreen("【广播】" + response.body);
        } else {
          printToScreen("收到一个空消息");
        }
      });

      // 订阅私人消息
      const subscription_personal = stompClient.subscribe('/user/'
        + sessionId + '/personal', (response) => {
        if (response.body) {
          printToScreen("【私人消息】" + response.body);
        } else {
          printToScreen("收到一个空消息");
        }
      });

      // 订阅异常消息
      const subscription_errors = stompClient.subscribe('/user/'
        + sessionId + '/errors', (response) => {
        if (response.body) {
          printToScreen("【异常消息】" + response.body);
        } else {
          printToScreen("收到一个空消息");
        }
      });


    },
    // 连接失败回调函数
    (error) => {
      document.getElementById("state-info").innerHTML = "连接断开";
      console.log('连接断开【' + error + '】');

      if (curTryNum <= maxTryNum) {
        document.getElementById("state-info").innerHTML
          = "连接关闭，10秒后重新连接……";
        console.log("连接关闭，10秒后重新连接……");

        // 10秒后重新连接，实际效果：每10秒重连一次，直到连接成功
        setTimeout(function () {
          connect();
        }, 10000);
      } else {
        document.getElementById("state-info").innerHTML
          = "连接关闭，且已超过最大重连次数，不再重连";
        console.log("连接关闭，且已超过最大重连次数，不再重连");
      }


    }
  );


  /**
   * 监听窗口关闭事件，窗口关闭前，主动关闭连接，防止连接还没断开就关闭窗口，server端会抛异常
   */
  window.onbeforeunload = function () {
    if (stompClient !== null) {
      stompClient.disconnect();
      socket.close();

    }
    console.log('断开连接');
  };

};

/**
 * 打印到输出容器中
 * @param message
 */
const printToScreen = (message) => {
  let op = document.getElementById('output');
  let p = document.createElement('p');
  p.style.wordWrap = 'break-word';
  p.innerHTML = message;
  op.appendChild(p);
  while (op.childNodes.length > 25) {
    op.removeChild(op.firstChild);
  }
  op.scrollTop = op.scrollHeight;

};


/**
 * 监听键盘事件，按下ENTER键时触发向服务器发送消息
 * @param KeyboardEvent
 */
document.getElementById("chat").onkeydown = (KeyboardEvent) => {
  if (KeyboardEvent.keyCode === 13) {
    const message = document.getElementById('chat').value;
    if (message !== "") {
      const headers = {};
      const body = {
        'message': message
      };
      stompClient.send("/chat", headers, JSON.stringify(body));
      document.getElementById('chat').value = '';
    }

  }
};
document.getElementById("speak").onkeydown = (KeyboardEvent) => {
  if (KeyboardEvent.keyCode === 13) {
    const message = document.getElementById('speak').value;
    if (message !== "") {
      const headers = {};
      const body = {
        'message': message
      };
      stompClient.send("/speak", headers, JSON.stringify(body));
      document.getElementById('speak').value = '';
    }

  }
};


/**
 * 执行入口，调用连接函数
 */
connect();
