package com.firejq.webchatroomstomp.controller;

import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

/**
 * <p>Title: </p> <p>Description: </p>
 *
 * @author <a href="mailto:firejq@outlook.com">firejq</a>
 * @date 2017/8/30
 */
@Controller
public class WebsocketController {

	/**
	 * 广播推送
	 *
	 * @param text
	 * @param sessionId
	 * @return
	 * @throws Exception
	 */
	@MessageMapping(value = "/chat")
	@SendTo("/topic/getResponse")
	public String talk(@Payload String text,
					   @Header("simpSessionId") String sessionId)
			throws Exception {
		System.out.println(
				"收到来自sessionId:【" + sessionId + "】的广播消息:【" + text + "】");
		return "【" + sessionId + "】说:【" + text + "】";
	}

	/**
	 * 点对点推送
	 *
	 * @param text
	 * @param sessionId
	 * @return
	 * @throws Exception
	 */
	@MessageMapping(value = "/speak")
	@SendToUser(value = "/personal")
	public String speak(@Payload String text,
						@Header("simpSessionId") String sessionId)
			throws Exception {
		System.out.println("收到私人消息:" + text);
		return text;
	}

	/**
	 * 异常信息推送
	 *
	 * @param exception
	 * @return
	 */
	@MessageExceptionHandler
	@SendToUser(value = "/errors")
	public String handleException(Throwable exception) {
		return exception.getMessage();
	}


}
