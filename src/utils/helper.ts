import { ResponseDTO } from '@/dto/request'

export const toCamelCase = (snake: string) => {
  if (/^[a-z]+[A-Za-z0-9]*$/.test(snake) && !/\d[a-z]/.test(snake)) {
    return snake
  }

  const camel = snake
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
  return camel.replace(/^_*[A-Z]/, (match) => match.toLowerCase())
}

export const toResponseDTO = (snake: string) => {
  const camel = toCamelCase(snake)
  const data: ResponseDTO = JSON.parse(camel);
  return data;
}


