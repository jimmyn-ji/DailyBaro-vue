import axios from 'axios';

// 基础url
const request = axios.create({
  baseURL: 'http://localhost:8081',   // 后端的接口地址  ip:port
})

// 调用流式聊天的函数
export const streamChat = (input) => {
  return request({
    method: 'get',
    url: '/ai/streamChat',
    params: { input }
  })
}

export default request