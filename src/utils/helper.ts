import { ResponseDTO } from '@/dto/request'
import _ from 'lodash'
import { ChatMessageType, MessageDTO } from '@/dto/message'

export const toCamelCase = (obj: any) => {

  return _.transform(obj, (acc: any, value: string, key: string, target: any) => {
    const camelKey = _.isArray(target) ? key : _.camelCase(key)

    acc[camelKey] = _.isObject(value) ? toCamelCase(value) : value
  })

}


export const toResponseDTO = (snake: string) => {
  const obj = JSON.parse(snake)
  const data: ResponseDTO = toCamelCase(obj) as ResponseDTO
  data.messages = data.messages.map(
    (message) => {
      message.messageId = message.messageId.replaceAll('_', '').toLowerCase()
      message.messageType = _.camelCase(message.messageType.toString()) as ChatMessageType

      return message as MessageDTO
    }
  )
  return data
}


